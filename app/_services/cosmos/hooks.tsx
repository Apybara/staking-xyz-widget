import type { IndexedTx } from "@cosmjs/stargate";
import type { BaseTxProcedure, TxProcedureType } from "../txProcedure/types";
import type { Network, WalletType, CosmosNetwork, CosmosWalletType } from "../../types";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useChain } from "@cosmos-kit/react-lite";
import { getOfflineSigners } from "graz";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStakeFees } from "../../_utils/transaction";
import { setMonitorTx, setMonitorGrantTx } from "../stakingOperator/cosmos/";
import { useCosmosAddressAuthCheck } from "../stakingOperator/cosmos/hooks";
import { cosmosNetworkVariants, networkInfo, feeReceiverByNetwork, stakingOperatorUrlByNetwork } from "../../consts";
import { getIsCosmosKitWalletType } from "./cosmosKit/utils";
import {
  useCosmosKitConnectors,
  useCosmosKitDisconnector,
  useCosmosKitWalletBalance,
  useCosmosKitWalletStates,
  useCosmosKitWalletSupports,
} from "./cosmosKit/hooks";
import { getGrazWalletTypeEnum, getIsGrazWalletType } from "./graz/utils";
import { useGrazConnectors, useGrazDisconnector, useGrazWalletBalance, useGrazWalletStates } from "./graz/hooks";
import { getDenomValueFromCoin, getIsCosmosNetwork, getIsCosmosWalletType } from "./utils";
import type { CosmosTxParams, CosmosTxStep } from "./types";
import { getSigningClient, getGrantingMessages, getEstimatedGas, getFee } from ".";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { CosmosStakingMsgType } from "../stakingOperator/types";
import { getOperatorMessage, getOperatorValidatorMessages } from "../stakingOperator/cosmos/";

const defaultNetwork = "celestia";

export const useCosmosTxProcedures = ({
  amount,
  network,
  wallet,
  address,
  type,
  authStep,
  signStep,
}: CosmosTxParams & {
  type: TxProcedureType;
  authStep?: CosmosTxStep;
  signStep: CosmosTxStep;
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");

  // const {
  //   data: authCheck,
  //   isLoading,
  //   refetch,
  // } = useCosmosAddressAuthCheck({ network, address: address || undefined });

  // const cosmosAuthTx = useCosmosBroadcastAuthzTx({
  //   client: client || null,
  //   network: network && isCosmosNetwork ? network : undefined,
  //   address: address || undefined,
  //   onPreparing: authStep?.onPreparing,
  //   onLoading: authStep?.onLoading,
  //   onBroadcasting: authStep?.onBroadcasting,
  //   onSuccess: authStep?.onSuccess,
  //   onError: authStep?.onError,
  // });

  const cosmosTx = useCosmosBroadcastTx({
    type,
    network: network || null,
    wallet: wallet || null,
    address: address || undefined,
    amount,
    onPreparing: signStep.onPreparing,
    onLoading: signStep.onLoading,
    onBroadcasting: signStep.onBroadcasting,
    onSuccess: signStep.onSuccess,
    onError: signStep.onError,
  });

  if (!isCosmosNetwork || !address) return null;

  const baseProcedures: Array<BaseTxProcedure> = [
    // {
    //   step: "auth",
    //   stepName: "Approval in wallet",
    //   send: cosmosAuthTx.send,
    //   tooltip: (
    //     <Tooltip
    //       className={StakeStyle.approvalTooltip}
    //       trigger={<Icon name="info" />}
    //       content={
    //         <>
    //           This approval lets Staking.xyz manage only staking actions on your behalf. You will always have full
    //           control of your funds. <a href={process.env.NEXT_PUBLIC_AUTHORIZATION_DOC_LINK}>(Read more)</a>
    //         </>
    //       }
    //     />
    //   ),
    // },
    {
      step: "sign",
      stepName: "Sign in wallet",
      send: cosmosTx.send,
    } as BaseTxProcedure,
  ];

  return {
    baseProcedures,
    // isAuthApproved: authCheck?.granted,
    // authTxHash: authCheck?.txnHash,
    // refetchAuthCheck: refetch,
    isAuthApproved: true,
    authTxHash: undefined,
    refetchAuthCheck: () => null,
  };
};

const useCosmosBroadcastAuthzTx = ({
  network,
  wallet,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: CosmosTxParams & CosmosTxStep) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : defaultNetwork) as CosmosNetwork;
  const { data: client } = useCosmosSigningClient({ network, wallet });

  const { error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosAuthzTx", address, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      onPreparing?.();

      const grantingMsgs = getGrantingMessages({
        granter: address,
        grantee: granteeAddress[castedNetwork],
      });
      const estimatedGas = await getEstimatedGas({ client, address, msgArray: grantingMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        networkDenom: networkInfo[network || defaultNetwork].denom,
      });

      onLoading?.();
      const txHash = await client.signAndBroadcastSync(address, grantingMsgs, fee);

      onBroadcasting?.();
      let txResult = null;
      const getTxResult = async (txHash: string) => {
        while (txHash) {
          const res = await client.getTx(txHash);
          if (res) {
            return res;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      txResult = (await getTxResult(txHash)) as unknown as IndexedTx;

      return {
        ...txResult,
        transactionHash: txHash,
      };
    },
    onSuccess: (res) => {
      if (res?.code) {
        const error = new Error("Sign in wallet failed");
        onError?.(error, res.transactionHash);
      } else {
        onSuccess?.(res.transactionHash);
        setMonitorGrantTx({
          apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
          txHash: res.transactionHash,
        });
      }
    },
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error]);

  return {
    reset,
    send: mutate,
  };
};

const useCosmosBroadcastTx = ({
  type,
  amount,
  network,
  wallet,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: CosmosTxParams & CosmosTxStep & { type: TxProcedureType }) => {
  const { mutationKey, operatorUrl, typeUrl } = broadcastTxMap[type];
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : defaultNetwork) as CosmosNetwork;
  const { data: client } = useCosmosSigningClient({ network, wallet });

  const { error, mutate, reset } = useMutation({
    mutationKey: [mutationKey, address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      onPreparing?.();

      const denomAmount = getDenomValueFromCoin({ network: castedNetwork, amount });
      const { unsignedMessage, uuid } = await getOperatorMessage({
        apiUrl: `${stakingOperatorUrlByNetwork[castedNetwork]}${operatorUrl}`,
        address,
        amount: Number(denomAmount),
      });
      const operatorValues = getOperatorValidatorMessages(unsignedMessage, typeUrl);
      // const feeReceiver = feeReceiverByNetwork[castedNetwork];
      // const feeAmount = getStakeFees({ amount: denomAmount, network: castedNetwork, floorResult: true });

      if (!operatorValues.length) {
        throw new Error("Missing parameter: validatorAddress");
      }

      const operatorMsgs = operatorValues.map((val) => ({
        typeUrl,
        value: {
          delegatorAddress: address,
          validatorAddress: val.validator,
          validatorSrcAddress: val.validatorSrc,
          validatorDstAddress: val.validatorDst,
          amount: val.amount,
        },
      }));
      // const feeCollectMsgs = [
      //   {
      //     typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      //     value: {
      //       fromAddress: address,
      //       toAddress: feeReceiver,
      //       amount: [
      //         {
      //           denom: networkInfo[network || defaultNetwork].denom,
      //           amount: feeAmount,
      //         },
      //       ],
      //     },
      //   },
      // ];
      // const msgs = [...operatorMsgs, ...feeCollectMsgs];
      const msgs = operatorMsgs;

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: msgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        networkDenom: networkInfo[network || defaultNetwork].denom,
      });

      onLoading?.();
      const txHash = await client.signAndBroadcastSync(address, msgs, fee);

      onBroadcasting?.();
      let txResult = null;
      const getTxResult = async (txHash: string) => {
        while (txHash) {
          const res = await client.getTx(txHash);
          if (res) {
            return res;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      txResult = (await getTxResult(txHash)) as unknown as IndexedTx;

      return {
        tx: {
          ...txResult,
          transactionHash: txHash,
        },
        uuid,
      };
    },
    onSuccess: ({ tx, uuid }) => {
      if (tx?.code) {
        const error = new Error("Sign in wallet failed");
        onError?.(error, tx.transactionHash);
      } else {
        onSuccess?.(tx.transactionHash);
        setMonitorTx({
          apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
          txHash: tx.transactionHash,
          uuid,
        });
      }
    },
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error]);

  return {
    reset,
    send: mutate,
  };
};

export const useCosmosWalletHasStoredConnection = () => {
  const [cosmosKitStorage] = useLocalStorage<
    Array<{
      address: string;
      chainId: string;
      namespace: string;
      username: string;
    }>
  >("cosmos-kit@2:core//accounts", []);
  const [grazStorage] = useLocalStorage<{
    state: {
      recentChainIds: Array<string> | null;
      _reconnect: boolean | null;
      _reconnectConnector: string | null;
    };
  }>("graz-internal", { state: { recentChainIds: null, _reconnect: null, _reconnectConnector: null } });

  const isCosmosKitStored = cosmosKitStorage?.some((s) => cosmosNetworkVariants.some((v) => v === s.chainId));
  const isGrazStored = grazStorage?.state?._reconnectConnector !== null;

  return isCosmosKitStored || isGrazStored;
};

export const useCosmosWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const cosmosKitStates = useCosmosKitWalletStates({ network });
  const grazStates = useGrazWalletStates({ network });

  if (grazStates.activeWallet && grazStates.address) {
    return grazStates;
  }
  if (cosmosKitStates.activeWallet && cosmosKitStates.address) {
    return cosmosKitStates;
  }
  return cosmosKitStates.activeWallet ? cosmosKitStates : grazStates;
};

export const useCosmosWalletBalance = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: CosmosNetwork | null;
  activeWallet: CosmosWalletType | null;
}) => {
  const cosmosKitBalance = useCosmosKitWalletBalance({ address, network, activeWallet });
  const grazBalance = useGrazWalletBalance({ address, network, activeWallet });

  if (!activeWallet) {
    return null;
  }
  if (getIsCosmosKitWalletType(activeWallet)) {
    return cosmosKitBalance;
  }
  return grazBalance;
};

export const useCosmosWalletConnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const {
    keplr: keplrConnect,
    keplrMobile,
    leap: leapConnect,
    leapMobile,
    okx: okxConnect,
  } = useCosmosKitConnectors(network);
  const { walletConnect } = useGrazConnectors(network);

  return {
    keplr: keplrConnect,
    keplrMobile,
    leap: leapConnect,
    leapMobile,
    okx: okxConnect,
    walletConnect,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletDisconnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const disconnectCosmosKit = useCosmosKitDisconnector({ network });
  const disconnectGraz = useGrazDisconnector({ network });

  return {
    keplr: disconnectCosmosKit,
    keplrMobile: disconnectCosmosKit,
    leap: disconnectCosmosKit,
    leapMobile: disconnectCosmosKit,
    okx: disconnectCosmosKit,
    walletConnect: disconnectGraz,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletSupports = () => {
  const { keplr: isKeplrSupported, leap: isLeapSupported, okx: isOkxSupported } = useCosmosKitWalletSupports();

  return {
    keplr: isKeplrSupported,
    keplrMobile: true,
    leap: isLeapSupported,
    leapMobile: true,
    okx: isOkxSupported,
    walletConnect: true,
  } as Record<CosmosWalletType, boolean>;
};

export const useCosmosSigningClient = ({ network, wallet }: { network: Network | null; wallet: WalletType | null }) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const isCosmosWallet = !!wallet && getIsCosmosWalletType(wallet);
  const castedNetwork = (isCosmosNetwork ? network : defaultNetwork) as CosmosNetwork;
  const castedWallet = isCosmosWallet ? (wallet as CosmosWalletType) : null;
  const shouldEnable = !!network && !!wallet && isCosmosNetwork;

  const offlineSignerGetter = useOfflineSignerGetter({ network: castedNetwork, wallet: castedWallet });

  const {
    data: signingClient,
    isLoading,
    error,
  } = useQuery({
    enabled: shouldEnable,
    queryKey: ["cosmosSigningClient", network, wallet, !!offlineSignerGetter],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getSigningClient({ network: network || undefined, getOfflineSigner: offlineSignerGetter });
    },
  });

  return { data: signingClient, isLoading, error };
};

const broadcastTxMap: Record<
  TxProcedureType,
  { mutationKey: string; operatorUrl: string; typeUrl: CosmosStakingMsgType }
> = {
  delegate: {
    mutationKey: "broadcastCosmosDelegateTx",
    operatorUrl: "stake/user/delegate",
    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
  },
  undelegate: {
    mutationKey: "signUndelegateCosmosMessage",
    operatorUrl: "stake/user/undelegate",
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
  },
  instant_undelegate: {
    mutationKey: "signUndelegateCosmosMessage",
    operatorUrl: "stake/user/undelegate",
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
  },
  claim: {
    mutationKey: "signWithdrawRewardsCosmosMessage",
    operatorUrl: "stake/user/claim",
    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
  },
  redelegate: {
    mutationKey: "broadcastCosmosRedelegateTx",
    operatorUrl: "stake/user/redelegate",
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
  },
};

const granteeAddress: Record<CosmosNetwork, string> = {
  celestia: process.env.NEXT_PUBLIC_CELESTIA_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
  cosmoshub: process.env.NEXT_PUBLIC_COSMOSHUB_AUTH_GRANTEE || "",
  cosmoshubtestnet: process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_AUTH_GRANTEE || "",
};

const useOfflineSignerGetter = ({ network, wallet }: { network?: CosmosNetwork; wallet: CosmosWalletType | null }) => {
  const { wallet: cosmosKitWallet, getOfflineSigner } = useChain(network || defaultNetwork);

  if (!!cosmosKitWallet && !!wallet && !!getIsCosmosKitWalletType(wallet)) {
    return async () => await getOfflineSigner();
  }
  if (!!wallet && getIsGrazWalletType(wallet)) {
    return async () =>
      (await getOfflineSigners({ walletType: getGrazWalletTypeEnum(wallet), chainId: network || defaultNetwork }))
        .offlineSigner;
  }
  return undefined;
};
