import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { AleoWalletType, AleoNetwork } from "../../types";
import type { BaseTxProcedure, TxProcedureType } from "../txProcedure/types";
import type { AleoTxParams, AleoTxStep } from "./types";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import {
  useIsLeoWalletInstalled,
  useLeoWalletStates,
  useLeoWalletConnector,
  useLeoWalletDisconnector,
  useLeoWalletHasStoredConnection,
  useLeoWalletStake,
  useLeoWalletUnstake,
  useLeoWalletWithdraw,
} from "./leoWallet/hooks";
import {
  usePuzzleStates,
  usePuzzleConnector,
  usePuzzleDisconnector,
  usePuzzleBalance,
  usePuzzleHasStoredConnection,
  usePuzzleStake,
  usePuzzleUnstake,
  usePuzzleWithdraw,
} from "./puzzle/hooks";
import { getMicroCreditsToCredits, getIsAleoNetwork, getIsAleoWalletType } from "./utils";

export const useAleoTxProcedures = ({
  amount,
  network,
  wallet,
  address,
  type,
  signStep,
}: AleoTxParams & {
  type: TxProcedureType;
  signStep: AleoTxStep;
}) => {
  const isAleoNetwork = getIsAleoNetwork(network || "");

  const aleoTx = useAleoBroadcastTx({
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

  if (!isAleoNetwork || !address) return null;

  const baseProcedures: Array<BaseTxProcedure> = [
    {
      step: "sign",
      stepName: "Sign in wallet",
      send: aleoTx.send,
    } as BaseTxProcedure,
  ];

  return {
    baseProcedures,
    isAuthApproved: true,
    authTxHash: undefined,
    refetchAuthCheck: () => null,
  };
};

const useAleoBroadcastTx = ({
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
}: AleoTxParams & AleoTxStep & { type: TxProcedureType }) => {
  const txMethodByWallet = useAleoTxMethodByWallet({ wallet, type });
  const isAleoNetwork = getIsAleoNetwork(network || "");

  const { error, mutate, reset } = useMutation({
    mutationKey: ["aleoTx", type, amount, wallet, network, address],
    mutationFn: async () => {
      if (!address || !amount || !txMethodByWallet) {
        throw new Error("Failed to broadcast transaction: missing address, amount, or txMethodByWallet");
      }

      onPreparing?.();

      // TODO: integrate with staking operator
      // const { validatorAddress, uuid } = await getOperatorMessage({
      //   apiUrl: `${stakingOperatorUrlByNetwork[castedNetwork]}${operatorUrl}`,
      //   address,
      //   amount: Number(denomAmount),
      // });
      const validatorAddress = "aleo1l2a3lakq9pz9w9hyre7rk9zmk64wzr62z0q26wglr8tmf8w5cyqqxtt364";
      const uuid = "uuid";
      if (!validatorAddress || !uuid) {
        throw new Error("Failed to broadcast transaction: missing validatorAddress or uuid");
      }

      onLoading?.();
      onBroadcasting?.();

      // TODO: use dynamic chainId
      const txId = await txMethodByWallet({ amount, validatorAddress, address, chainId: "aleo" });
      return {
        txId,
        uuid,
      };
    },
    onSuccess: ({ txId, uuid }) => {
      if (txId) {
        const error = new Error("Sign in wallet failed");
        onError?.(error, txId);
      } else {
        onSuccess?.(txId);
        // TODO: integrate with staking operator
        // setMonitorTx({
        //   apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        //   txHash: txId,
        //   uuid,
        // });
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

const useAleoTxMethodByWallet = ({ wallet, type }: { wallet: AleoTxParams["wallet"]; type: TxProcedureType }) => {
  const isAleoWalletType = getIsAleoWalletType(wallet || "");

  const leoWalletStake = useLeoWalletStake();
  const leoWalletUnstake = useLeoWalletUnstake();
  const leoWalletWithdraw = useLeoWalletWithdraw();

  const puzzleStake = usePuzzleStake();
  const puzzleUnstake = usePuzzleUnstake();
  const puzzleWithdraw = usePuzzleWithdraw();

  if (!isAleoWalletType) return null;

  if (wallet === "leoWallet") {
    if (type === "delegate") return leoWalletStake;
    if (type === "undelegate") return leoWalletUnstake;
    if (type === "claim") return leoWalletWithdraw;
  }
  if (wallet === "puzzle") {
    if (type === "delegate") return puzzleStake;
    if (type === "undelegate") return puzzleUnstake;
    if (type === "claim") return puzzleWithdraw;
  }
  return null;
};

export const useAleoWalletSupports = (): Record<AleoWalletType, boolean> => {
  const isLeoWalletInstalled = useIsLeoWalletInstalled();

  return {
    leoWallet: isLeoWalletInstalled,
    puzzle: true,
  };
};

export const useAleoWalletConnectors = () => {
  const leoWalletConnector = useLeoWalletConnector();
  const puzzleWalletConnect = usePuzzleConnector();

  return {
    leoWallet: leoWalletConnector,
    puzzle: puzzleWalletConnect,
  };
};

export const useAleoWalletDisconnectors = () => {
  const disconnect = useLeoWalletDisconnector();
  const puzzleWalletDisconnect = usePuzzleDisconnector();

  return {
    leoWallet: disconnect,
    puzzle: puzzleWalletDisconnect,
  };
};

export const useAleoWalletStates = () => {
  const leoWalletStates = useLeoWalletStates();
  const puzzleStates = usePuzzleStates();

  if (leoWalletStates.connectionStatus !== "disconnected") return leoWalletStates;
  if (puzzleStates.connectionStatus !== "disconnected") return puzzleStates;
  return {
    activeWallet: null,
    address: null,
    connectionStatus: "disconnected" as WalletStates["connectionStatus"],
  };
};

export const useAleoWalletBalance = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: AleoNetwork | null;
  activeWallet: AleoWalletType | null;
}) => {
  const leoWalletBalance = useAleoBalanceFromStakingOperator({ address, network });
  const puzzleBalance = usePuzzleBalance({ address });

  if (!activeWallet) return null;
  if (activeWallet === "leoWallet") return leoWalletBalance;
  if (activeWallet === "puzzle") return puzzleBalance;
  return null;
};

const useAleoBalanceFromStakingOperator = ({
  address,
  network,
  refetchInterval = 15000,
}: {
  address: string | null;
  network: AleoNetwork | null;
  refetchInterval?: number;
}) => {
  const balanceFromStakingOperator = undefined;

  if (!address || !balanceFromStakingOperator) return null;
  return {
    isLoading: false,
    error: null,
    data: getMicroCreditsToCredits(balanceFromStakingOperator).toString(),
  };
};

export const useAleoWalletHasStoredConnection = () => {
  const hasLeoWalletStoredConnection = useLeoWalletHasStoredConnection();
  const hasPuzzleStoredConnection = usePuzzleHasStoredConnection();

  return hasLeoWalletStoredConnection || hasPuzzleStoredConnection;
};
