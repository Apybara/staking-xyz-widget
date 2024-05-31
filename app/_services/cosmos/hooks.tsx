import type { IndexedTx, SigningStargateClient } from "@cosmjs/stargate";
import type { BaseStakeProcedure } from "../stake/types";
import type { BaseUnstakeProcedure } from "../unstake/types";
import type { BaseRedelegateProcedure } from "../redelegate/types";
import type { BaseClaimProcedure } from "../rewards/types";
import type { CosmosNetwork, Network, CosmosWalletType } from "../../types";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useChain } from "@cosmos-kit/react-lite";
import { getOfflineSigners } from "graz";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStakeFees } from "../../_utils/transaction";
import {
  getDelegateMessage,
  getDelegateValidatorMessages,
  getUndelegateMessage,
  getUndelegateValidatorMessages,
  setMonitorTx,
  setMonitorGrantTx,
  getRedelegateMessage,
  getRedelegateValidatorMessages,
  getWithdrawRewardsMessage,
  getWithdrawRewardsValidatorMessages,
} from "../stakingOperator/celestia";
import { useCelestiaAddressAuthCheck } from "../stakingOperator/celestia/hooks";
import {
  cosmosNetworkVariants,
  networkInfo,
  feeReceiverByNetwork,
  defaultNetwork,
  stakingOperatorUrlByNetwork,
} from "../../consts";
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
  authStep,
  undelegateStep,
}: {
  amount: string;
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  authStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
  undelegateStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  // const {
  //   data: authCheck,
  //   isLoading,
  //   refetch,
  // } = useCelestiaAddressAuthCheck({ network, address: address || undefined });

  // const authTx = useCosmosBroadcastAuthzTx({
  //   client: cosmosSigningClient || null,
  //   network: network && isCosmosNetwork ? network : undefined,
  //   address: address || undefined,
  //   onPreparing: authStep.onPreparing,
  //   onLoading: authStep.onLoading,
  //   onBroadcasting: authStep.onBroadcasting,
  //   onSuccess: authStep.onSuccess,
  //   onError: authStep.onError,
  // });

  const undelegateTx = useCosmosUndelegate({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onPreparing: undelegateStep.onPreparing,
    onLoading: undelegateStep.onLoading,
    onBroadcasting: undelegateStep.onBroadcasting,
    onSuccess: undelegateStep.onSuccess,
    onError: undelegateStep.onError,
  });

  if (!isCosmosNetwork || !address) return null;

  const procedures = [
    // {
    //   step: "auth",
    //   stepName: "Approval in wallet",
    //   send: authTx.send,
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
      step: "undelegate",
      stepName: "Sign in wallet",
      send: undelegateTx.send,
    } as BaseUnstakeProcedure,
  ];

  return {
    baseProcedures: procedures,
    // isAuthApproved: authCheck?.granted,
    // authTxHash: authCheck?.txnHash,
    // refetchAuthCheck: refetch,
    isAuthApproved: true,
    authTxHash: undefined,
    refetchAuthCheck: () => null,
  };
};

export const useCosmosUndelegate = ({
  client,
  amount,
  network,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { error, mutate, reset } = useMutation({
    mutationKey: ["signUndelegateCosmosMessage", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }
      onPreparing?.();

      const denomAmount = getDenomValueFromCoin({ network: network || defaultNetwork, amount });
      const { unsignedMessage, uuid } = await getUndelegateMessage({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
        amount: Number(denomAmount),
      });
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
        network: network || defaultNetwork,
        networkDenom: networkInfo[network || defaultNetwork].denom,
      });

      onLoading?.();
      const txHash = await client.signAndBroadcastSync(address, undelegateMsgs, fee);

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
      txResult = await getTxResult(txHash);

      return {
        tx: {
          ...txResult,
          transactionHash: txHash,
        },
        uuid,
      };
    },
    onSuccess: ({ tx, uuid }) => {
      onSuccess?.(tx.transactionHash);
      setMonitorTx({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        txHash: tx.transactionHash,
        uuid,
      });
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
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error, txHash?: string) => void;
  };
  delegateStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error, txHash?: string) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  // const {
  //   data: authCheck,
  //   isLoading,
  //   refetch,
  // } = useCelestiaAddressAuthCheck({ network, address: address || undefined });

  // const cosmosAuthTx = useCosmosBroadcastAuthzTx({
  //   client: cosmosSigningClient || null,
  //   network: network && isCosmosNetwork ? network : undefined,
  //   address: address || undefined,
  //   onPreparing: authStep.onPreparing,
  //   onLoading: authStep.onLoading,
  //   onBroadcasting: authStep.onBroadcasting,
  //   onSuccess: authStep.onSuccess,
  //   onError: authStep.onError,
  // });
  const cosmosDelegateTx = useCosmosBroadcastDelegateTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onPreparing: delegateStep.onPreparing,
    onLoading: delegateStep.onLoading,
    onBroadcasting: delegateStep.onBroadcasting,
    onSuccess: delegateStep.onSuccess,
    onError: delegateStep.onError,
  });

  if (!isCosmosNetwork || !address) return null;

  const baseProcedures: Array<BaseStakeProcedure> = [
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
      step: "delegate",
      stepName: "Sign in wallet",
      send: cosmosDelegateTx.send,
    } as BaseStakeProcedure,
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
  client,
  network,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  network?: CosmosNetwork;
  address?: string;
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error, txHash?: string) => void;
}) => {
  const { error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosAuthzTx", address, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      onPreparing?.();

      const grantingMsgs = getGrantingMessages({
        granter: address,
        grantee: granteeAddress[network || defaultNetwork],
      });
      const estimatedGas = await getEstimatedGas({ client, address, msgArray: grantingMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || defaultNetwork,
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

const useCosmosBroadcastDelegateTx = ({
  client,
  amount,
  network,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error, txHash?: string) => void;
}) => {
  const { error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosDelegateTx", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      onPreparing?.();

      const denomAmount = getDenomValueFromCoin({ network: network || defaultNetwork, amount });
      const { unsignedMessage, uuid } = await getDelegateMessage({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
        amount: Number(denomAmount),
      });
      const delegateValues = getDelegateValidatorMessages(unsignedMessage);
      const feeReceiver = feeReceiverByNetwork[network || defaultNetwork];
      // const feeAmount = getStakeFees({ amount: denomAmount, network: network || defaultNetwork, floorResult: true });

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
      // const msgs = [...delegateMsgs, ...feeCollectMsgs];
      const msgs = delegateMsgs;

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: msgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || defaultNetwork,
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

export const useCosmosWithdrawRewardsProcedures = ({
  network,
  address,
  cosmosSigningClient,
  withdrawRewardsStep,
}: {
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  withdrawRewardsStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error, txHash?: string) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");

  const undelegateTx = useCosmosWithdrawRewards({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    onPreparing: withdrawRewardsStep.onPreparing,
    onLoading: withdrawRewardsStep.onLoading,
    onBroadcasting: withdrawRewardsStep.onBroadcasting,
    onSuccess: withdrawRewardsStep.onSuccess,
    onError: withdrawRewardsStep.onError,
  });

  if (!isCosmosNetwork || !address) return null;

  const procedures = [
    {
      step: "claim",
      stepName: "Sign in wallet",
      send: undelegateTx.send,
    } as BaseClaimProcedure,
  ];

  return {
    baseProcedures: procedures,
  };
};

export const useCosmosWithdrawRewards = ({
  client,
  network,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  network?: CosmosNetwork;
  address?: string;
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { error, mutate, reset } = useMutation({
    mutationKey: ["signWithdrawRewardsCosmosMessage", address, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }
      onPreparing?.();

      const { unsignedMessage, uuid } = await getWithdrawRewardsMessage({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
      });
      const withdrawRewardsValues = getWithdrawRewardsValidatorMessages(unsignedMessage);

      if (!withdrawRewardsValues.length) {
        throw new Error("Missing parameter: validatorAddress");
      }

      const undelegateMsgs = withdrawRewardsValues.map((val) => ({
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: {
          delegatorAddress: address,
          validatorAddress: val.validator,
        },
      }));

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: undelegateMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || defaultNetwork,
        networkDenom: networkInfo[network || defaultNetwork].denom,
      });

      onLoading?.();
      const txHash = await client.signAndBroadcastSync(address, undelegateMsgs, fee);

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
      txResult = await getTxResult(txHash);

      return {
        tx: {
          ...txResult,
          transactionHash: txHash,
        },
        uuid,
      };
    },
    onSuccess: ({ tx, uuid }) => {
      onSuccess?.(tx.transactionHash);
      setMonitorTx({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        txHash: tx.transactionHash,
        uuid,
      });
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

export const useCosmosRedelegatingProcedures = ({
  amount,
  network,
  address,
  cosmosSigningClient,
  authStep,
  redelegateStep,
}: {
  amount: string;
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  authStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
  redelegateStep: {
    onPreparing: () => void;
    onLoading: () => void;
    onBroadcasting: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  // const {
  //   data: authCheck,
  //   isLoading,
  //   refetch,
  // } = useCelestiaAddressAuthCheck({ network, address: address || undefined });

  // const cosmosAuthTx = useCosmosBroadcastAuthzTx({
  //   client: cosmosSigningClient || null,
  //   network: network && isCosmosNetwork ? network : undefined,
  //   address: address || undefined,
  //   onLoading: authStep.onLoading,
  //   onSuccess: authStep.onSuccess,
  //   onError: authStep.onError,
  // });
  const cosmosRedelegateTx = useCosmosBroadcastRedelegateTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onPreparing: redelegateStep.onPreparing,
    onLoading: redelegateStep.onLoading,
    onBroadcasting: redelegateStep.onBroadcasting,
    onSuccess: redelegateStep.onSuccess,
    onError: redelegateStep.onError,
  });

  // TODO: handle error state
  if (!isCosmosNetwork || !address) return null;

  const baseProcedures: Array<BaseRedelegateProcedure> = [
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
    //           This approval lets Staking.xyz manage staking operations on your behalf. You always have full control of
    //           your funds. <a href="#">(more)</a>
    //         </>
    //       }
    //     />
    //   ),
    // },
    {
      step: "redelegate",
      stepName: "Sign in wallet",
      send: cosmosRedelegateTx.send,
    } as BaseRedelegateProcedure,
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

const useCosmosBroadcastRedelegateTx = ({
  client,
  amount,
  network,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error, txHash?: string) => void;
}) => {
  const { error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosRedelegateTx", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      onPreparing?.();

      const denomAmount = getDenomValueFromCoin({ network: network || defaultNetwork, amount });
      const { unsignedMessage, uuid } = await getRedelegateMessage({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
        amount: Number(denomAmount),
      });
      const reDelegateValues = getRedelegateValidatorMessages(unsignedMessage);
      const feeReceiver = feeReceiverByNetwork[network || defaultNetwork];
      // const feeAmount = getStakeFees({ amount: denomAmount, network: network || defaultNetwork, floorResult: true });

      if (!reDelegateValues.length || feeReceiver === "") {
        throw new Error("Missing parameter: validatorAddress, feeReceiver");
      }

      const redelegateMsgs = reDelegateValues.map((val) => ({
        typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
        value: {
          delegatorAddress: address,
          validatorAddress: val.validator,
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
      // const msgs = [...redelegateMsgs, ...feeCollectMsgs];
      const msgs = redelegateMsgs;

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: msgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || defaultNetwork,
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
    queryKey: ["cosmosSigningClient", network, wallet, !!offlineSignerGetter],
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
