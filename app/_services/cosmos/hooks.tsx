import type { SigningStargateClient } from "@cosmjs/stargate";
import type { BaseStakeProcedure } from "../../_services/stake/types";
import type { BaseUnstakeProcedure } from "../../_services/unstake/types";
import type { CosmosNetwork, Network, CosmosWalletType } from "../../types";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useChain } from "@cosmos-kit/react-lite";
import { getOfflineSigners } from "graz";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFeeCollectingAmount } from "../../_services/stake";
import {
  getDelegateMessage,
  getDelegateValidatorMessages,
  getUndelegateMessage,
  getUndelegateValidatorMessages,
  setMonitorTx,
} from "../stakingOperator/celestia";
import { useCelestiaAddressAuthCheck } from "../stakingOperator/celestia/hooks";
import { cosmosNetworkVariants, networkInfo, feeReceiverByNetwork } from "../../consts";
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
import { getDenomValueFromCoin, getIsCosmosNetwork } from "./utils";
import { getSigningClient, getGrantingMessages, getEstimatedGas, getFee } from ".";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

import * as StakeStyle from "@/app/(root)/stake/_components/stake.css";

export const useCosmosUnstakingProcedures = ({
  amount,
  network,
  address,
  cosmosSigningClient,
  undelegateStep,
}: {
  amount: string;
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  undelegateStep: {
    onLoading: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");

  const undelegateTx = useCosmosUndelegate({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onLoading: undelegateStep.onLoading,
    onSuccess: undelegateStep.onSuccess,
    onError: undelegateStep.onError,
  });

  // TODO: handle error state
  if (!isCosmosNetwork || !address) return null;

  const procedures = [
    {
      step: "undelegate",
      stepName: "Sign in wallet",
      send: undelegateTx.send,
    } as BaseUnstakeProcedure,
  ];

  return {
    baseProcedures: procedures,
    firstStep: procedures[0].step,
  };
};

export const useCosmosUndelegate = ({
  client,
  amount,
  network,
  address,
  onLoading,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onLoading?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { isPending, error, mutate, reset } = useMutation({
    mutationKey: ["signUndelegateCosmosMessage", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      const denomAmount = getDenomValueFromCoin({ network: network || "celestia", amount });
      const { unsignedMessage, uuid } = await getUndelegateMessage(address, Number(denomAmount));
      const undelegateValues = getUndelegateValidatorMessages(unsignedMessage);

      if (!undelegateValues.length) {
        throw new Error("Missing parameter: validatorAddress");
      }

      const undelegateMsgs = undelegateValues.map((val) => ({
        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
        value: {
          delegatorAddress: address,
          validatorAddress: val.validator,
          amount: val.amount,
        },
      }));

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: undelegateMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: networkInfo[network || "celestia"].denom,
      });

      const res = await client.signAndBroadcast(address, undelegateMsgs, fee);
      return {
        tx: res,
        uuid,
      };
    },
    onSuccess: ({ tx, uuid }) => {
      onSuccess?.(tx.transactionHash);
      setMonitorTx({ txHash: tx.transactionHash, uuid });
    },
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (isPending) {
      onLoading?.();
    }
  }, [isPending]);

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

export const useCosmosStakingProcedures = ({
  amount,
  network,
  address,
  cosmosSigningClient,
  authStep,
  delegateStep,
}: {
  amount: string;
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  authStep: {
    onLoading: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
  delegateStep: {
    onLoading: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const {
    data: isAddressAuthorized,
    isLoading,
    refetch,
  } = useCelestiaAddressAuthCheck({ address: address || undefined });

  const cosmosAuthTx = useCosmosBroadcastAuthzTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    onLoading: authStep.onLoading,
    onSuccess: authStep.onSuccess,
    onError: authStep.onError,
  });
  const cosmosDelegateTx = useCosmosBroadcastDelegateTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onLoading: delegateStep.onLoading,
    onSuccess: delegateStep.onSuccess,
    onError: delegateStep.onError,
  });

  // TODO: handle error state
  if (!isCosmosNetwork || !address || isLoading) return null;

  const base = [
    {
      step: "delegate",
      stepName: "Sign in wallet",
      send: cosmosDelegateTx.send,
    } as BaseStakeProcedure,
  ];
  const baseProcedures: Array<BaseStakeProcedure> = isAddressAuthorized
    ? base
    : [
        {
          step: "auth",
          stepName: "Approval in wallet",
          send: cosmosAuthTx.send,
          tooltip: (
            <Tooltip
              className={StakeStyle.approvalTooltip}
              trigger={<Icon name="info" />}
              content={
                <>
                  This approval lets Staking.xyz manage staking operations on your behalf. You will always have full
                  control of your funds. <a href="#">(more)</a>
                </>
              }
            />
          ),
        },
        ...base,
      ];

  return {
    baseProcedures,
    firstStep: baseProcedures[0].step,
    refetchAuthCheck: refetch,
  };
};

const useCosmosBroadcastAuthzTx = ({
  client,
  network,
  address,
  onLoading,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  network?: CosmosNetwork;
  address?: string;
  onLoading?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { isPending, error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosAuthzTx", address, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      const grantingMsgs = getGrantingMessages({ granter: address, grantee: granteeAddress[network || "celestia"] });
      const estimatedGas = await getEstimatedGas({ client, address, msgArray: grantingMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: networkInfo[network || "celestia"].denom,
      });

      return await client.signAndBroadcast(address, grantingMsgs, fee);
    },
    onSuccess: (res) => onSuccess?.(res.transactionHash),
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (isPending) {
      onLoading?.();
    }
  }, [isPending]);

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

const useCosmosBroadcastDelegateTx = ({
  client,
  amount,
  network,
  address,
  onLoading,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onLoading?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { isPending, error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosDelegateTx", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      const denomAmount = getDenomValueFromCoin({ network: network || "celestia", amount });
      const { unsignedMessage, uuid } = await getDelegateMessage(address, Number(denomAmount));
      const delegateValues = getDelegateValidatorMessages(unsignedMessage);
      const feeReceiver = feeReceiverByNetwork[network || "celestia"];
      const feeAmount = getFeeCollectingAmount({ amount: denomAmount, network: network || "celestia" });

      if (!delegateValues.length || feeReceiver === "") {
        throw new Error("Missing parameter: validatorAddress, feeReceiver");
      }

      const delegateMsgs = delegateValues.map((val) => ({
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: {
          delegatorAddress: address,
          validatorAddress: val.validator,
          amount: val.amount,
        },
      }));
      const feeCollectMsgs = [
        {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: address,
            toAddress: feeReceiver,
            amount: [
              {
                denom: networkInfo[network || "celestia"].denom,
                amount: feeAmount,
              },
            ],
          },
        },
      ];
      const msgs = [...delegateMsgs, ...feeCollectMsgs];

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: msgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: networkInfo[network || "celestia"].denom,
      });

      const res = await client.signAndBroadcast(address, msgs, fee);
      return {
        tx: res,
        uuid,
      };
    },
    onSuccess: ({ tx, uuid }) => {
      onSuccess?.(tx.transactionHash);
      setMonitorTx({ txHash: tx.transactionHash, uuid });
    },
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (isPending) {
      onLoading?.();
    }
  }, [isPending]);

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
  const { keplr: keplrConnect, leap: leapConnect, okx: okxConnect } = useCosmosKitConnectors(network);
  const { keplrMobile, leapMobile, walletConnect } = useGrazConnectors(network);

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
    keplrMobile: disconnectGraz,
    leap: disconnectCosmosKit,
    leapMobile: disconnectGraz,
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

export const useCosmosSigningClient = ({
  network,
  wallet,
}: {
  network?: CosmosNetwork;
  wallet: CosmosWalletType | null;
}) => {
  const offlineSignerGetter = useOfflineSignerGetter({ network, wallet });

  const {
    data: signingClient,
    isLoading,
    error,
  } = useQuery({
    enabled: !!network && !!wallet,
    queryKey: ["cosmosSigningClient", network, wallet, offlineSignerGetter],
    queryFn: () => getSigningClient({ network, getOfflineSigner: offlineSignerGetter }),
  });

  return { data: signingClient, isLoading, error };
};

const granteeAddress: Record<CosmosNetwork, string> = {
  celestia: process.env.NEXT_PUBLIC_CELESTIA_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
};

const useOfflineSignerGetter = ({ network, wallet }: { network?: CosmosNetwork; wallet: CosmosWalletType | null }) => {
  const { wallet: cosmosKitWallet, getOfflineSigner } = useChain(network || "celestia");

  if (!!cosmosKitWallet && !!wallet && !!getIsCosmosKitWalletType(wallet)) {
    return async () => await getOfflineSigner();
  }
  if (!!wallet && getIsGrazWalletType(wallet)) {
    return async () =>
      (await getOfflineSigners({ walletType: getGrazWalletTypeEnum(wallet), chainId: network || "celestia" }))
        .offlineSigner;
  }
  return undefined;
};
