import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { AleoWalletType, AleoNetwork, Network, StakingType } from "../../types";
import type { BaseTxProcedure, TxProcedureType } from "../txProcedure/types";
import type { AleoTxParams, AleoTxStatusResponse, AleoTxStep } from "./types";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  stakingOperatorUrlByNetwork,
  ALEO_PONDO_CORE_ID,
  ALEO_PONDO_TOKEN_ID,
  ALEO_PONDO_TOKEN_NETWORK,
  ALEO_MTSP_ID,
} from "../../consts";
import { getPuzzleTxStatus } from "./puzzle";
import { getLeoWalletTxStatus } from "./leoWallet";
import { useAleoAddressBalance } from "../stakingOperator/aleo/hooks";
import { getOperatorResponseQuery, setMonitorTxByAddress } from "../stakingOperator/aleo";
import { getAleoAddressUnbondingStatus, getPAleoBalanceByAddress } from "./sdk";
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
import {
  getIsAleoAddressFormat,
  getMicroCreditsToCredits,
  getCreditsToMicroCredits,
  getIsAleoNetwork,
  getIsAleoWalletType,
} from "./utils";
import { networkEndpoints } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { usePondoData } from "./pondo/hooks";

export const usePAleoBalanceByAddress = ({ address, network }: { address?: string; network: Network | null }) => {
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoAddressFormat = getIsAleoAddressFormat(address || "");
  const shouldEnable = isAleoNetwork && isAleoAddressFormat;

  const { data, error, isLoading, isRefetching } = useQuery({
    enabled: shouldEnable,
    queryKey: ["paleoBalanceByAddress", address, network],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getPAleoBalanceByAddress({
        apiUrl: networkEndpoints.aleo.rpc,
        address: address || "",
        tokenId: ALEO_PONDO_TOKEN_ID,
        tokenIdNetwork: ALEO_PONDO_TOKEN_NETWORK,
        mtspProgramId: ALEO_MTSP_ID,
      });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return {
    data,
    stakedBalance: getMicroCreditsToCredits(data || 0).toString(),
    isLoading,
    isRefetching,
    error,
  };
};

export const useAleoAddressUnbondingStatus = ({ address, network }: { address?: string; network: Network | null }) => {
  const { stakingType } = useShell();
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoAddressFormat = getIsAleoAddressFormat(address || "");
  const shouldEnable = isAleoNetwork && isAleoAddressFormat;

  const { data, error, isLoading } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoAddressUnbondingStatus", address, network, stakingType],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getAleoAddressUnbondingStatus({
        apiUrl: networkEndpoints.aleo.rpc,
        address: address || "",
        stakingType,
        pondoProgramId: ALEO_PONDO_CORE_ID,
      });
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  if (!address || !data) return null;

  return {
    amount: getMicroCreditsToCredits(data.amount).toString(),
    isWithdrawable: data.isWithdrawable,
    completionTime: data.completionTime,
    isLoading,
    error,
  };
};

export const useAleoTxProcedures = ({
  amount,
  network,
  wallet,
  address,
  type,
  signStep,
  instantWithdrawal,
}: AleoTxParams & {
  type: TxProcedureType;
  signStep: AleoTxStep;
  instantWithdrawal?: boolean;
}) => {
  const isAleoNetwork = getIsAleoNetwork(network || "");

  const aleoTx = useAleoBroadcastTx({
    type,
    network: network || null,
    wallet: wallet || null,
    address: address || undefined,
    amount,
    instantWithdrawal,
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
  amount = "",
  network,
  wallet,
  address,
  instantWithdrawal,
  onPreparing,
  onLoading,
  onBroadcasting,
  onSuccess,
  onError,
}: AleoTxParams & AleoTxStep & { type: TxProcedureType; instantWithdrawal?: boolean }) => {
  const { operatorUrl } = broadcastTxMap[type];
  const { wallet: leoWallet } = useLeoWallet();
  const { stakingType } = useShell();
  const { mintRate } = usePondoData() || {};
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const txMethodByWallet = useAleoTxMethodByWallet({ wallet, type });
  const castedNetwork = (isAleoNetwork ? network : "aleo") as AleoNetwork;
  const operatorResponseQuery = getOperatorResponseQuery({ type });

  const { error, mutate, reset } = useMutation({
    mutationKey: ["aleoTx", type, amount, wallet, network, address, instantWithdrawal],
    mutationFn: async () => {
      if (!address || !txMethodByWallet) {
        throw new Error("Failed to broadcast transaction: missing address or txMethodByWallet");
      }

      onPreparing?.();

      const { validatorAddress, uuid, txFee } = await operatorResponseQuery({
        apiUrl: `${stakingOperatorUrlByNetwork[castedNetwork]}${operatorUrl}`,
        address,
        amount,
        stakingOption: stakingType as StakingType,
      });
      if (!uuid) {
        throw new Error("Failed to broadcast transaction: missing uuid");
      }

      onLoading?.();
      // TODO: use dynamic chainId
      const txId = await txMethodByWallet({
        amount,
        validatorAddress: validatorAddress || "",
        address,
        chainId: "aleo",
        txFee,
        mintRate: mintRate || 1,
        instantWithdrawal,
      });

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
        amount,
      };
    },
    onSuccess: ({ txId, isError, amount }) => {
      const validTxId = wallet === "leoWallet" ? undefined : txId;

      if (isError) {
        const error = new Error("Sign in wallet failed");
        onError?.(error, validTxId);
      } else {
        onSuccess?.(validTxId);
        setMonitorTxByAddress({
          apiUrl: stakingOperatorUrlByNetwork[network || "aleo"],
          address: address || "",
          type,
          stakingType: stakingType as StakingType,
          amount: getCreditsToMicroCredits(amount || 0),
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
