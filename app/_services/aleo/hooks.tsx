import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { AleoWalletType, AleoNetwork, StakingType } from "../../types";
import type { BaseTxProcedure, TxProcedureType } from "../txProcedure/types";
import type { AleoTxParams, AleoTxStatusResponse, AleoTxStep } from "./types";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { stakingOperatorUrlByNetwork } from "../../consts";
import { getPuzzleTxStatus } from "./puzzle";
import { getLeoWalletTxStatus } from "./leoWallet";
import { useAleoAddressBalance } from "../stakingOperator/aleo/hooks";
import { getOperatorValidator, setMonitorTx } from "../stakingOperator/aleo";
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
  stakingType = "native",
  amount,
  network,
  wallet,
  address,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: AleoTxParams & AleoTxStep & { type: TxProcedureType; stakingType?: StakingType }) => {
  const { operatorUrl } = broadcastTxMap[type];
  const { wallet: leoWallet } = useLeoWallet();
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const txMethodByWallet = useAleoTxMethodByWallet({ wallet, type });
  const castedNetwork = (isAleoNetwork ? network : "aleo") as AleoNetwork;

  const { error, mutate, reset } = useMutation({
    mutationKey: ["aleoTx", type, amount, wallet, network, address],
    mutationFn: async () => {
      if (!address || !amount || !txMethodByWallet) {
        throw new Error("Failed to broadcast transaction: missing address, amount, or txMethodByWallet");
      }

      onPreparing?.();

      const { validatorAddress, uuid } = await getOperatorValidator({
        apiUrl: `${stakingOperatorUrlByNetwork[castedNetwork]}${operatorUrl}`,
        address,
        amount,
        stakingOption: stakingType,
      });
      if (!validatorAddress || !uuid) {
        throw new Error("Failed to broadcast transaction: missing validatorAddress or uuid");
      }

      onLoading?.();
      // TODO: use dynamic chainId
      const txId = await txMethodByWallet({ amount, validatorAddress, address, chainId: "aleo" });

      onBroadcasting?.();

      let txRes: AleoTxStatusResponse | undefined = undefined;
      const getTxResult = async (txId: string) => {
        while (txId) {
          switch (wallet) {
            case "leoWallet":
              const leoWalletTxStatus = await getLeoWalletTxStatus({ txId, wallet: leoWallet });
              if (leoWalletTxStatus.status !== "loading") return leoWalletTxStatus;
              break;
            case "puzzle":
              const puzzleWalletTxStatus = await getPuzzleTxStatus({ id: txId, address, chainId: castedNetwork });
              if (puzzleWalletTxStatus.status !== "loading") return puzzleWalletTxStatus;
              break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      txRes = await getTxResult(txId);

      if (!txRes || txRes.status === "error") {
        return {
          txId: txRes?.txId,
          uuid,
          isError: true,
        };
      }

      return {
        txId: txRes.txId || txId,
        uuid,
      };
    },
    onSuccess: ({ txId, uuid, isError }) => {
      const validTxId = wallet === "leoWallet" ? undefined : txId;

      if (isError) {
        const error = new Error("Sign in wallet failed");
        onError?.(error, validTxId);
      } else {
        onSuccess?.(validTxId);
        if (txId) {
          setMonitorTx({
            apiUrl: stakingOperatorUrlByNetwork[network || "aleo"],
            txHash: txId,
            uuid,
          });
        }
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
}: {
  address: string | null;
  network: AleoNetwork | null;
}) => {
  const {
    data: balanceFromStakingOperator,
    isLoading,
    error,
  } = useAleoAddressBalance({
    network,
    address: address || "",
  });

  if (!address || balanceFromStakingOperator?.balance === undefined) return null;

  return {
    data: getMicroCreditsToCredits(balanceFromStakingOperator.balance).toString(),
    isLoading,
    error,
  };
};

export const useAleoWalletHasStoredConnection = () => {
  const hasLeoWalletStoredConnection = useLeoWalletHasStoredConnection();
  const hasPuzzleStoredConnection = usePuzzleHasStoredConnection();

  return hasLeoWalletStoredConnection || hasPuzzleStoredConnection;
};

const broadcastTxMap: Record<TxProcedureType, { operatorUrl: string }> = {
  delegate: {
    operatorUrl: "stake/user/delegate",
  },
  undelegate: {
    operatorUrl: "stake/user/undelegate",
  },
  claim: {
    operatorUrl: "stake/user/claim",
  },
  redelegate: {
    operatorUrl: "",
  },
};
