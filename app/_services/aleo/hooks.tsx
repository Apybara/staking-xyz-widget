import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { AleoWalletType, AleoNetwork, Network, StakingType, SendingTransaction } from "../../types";
import type { BaseTxProcedure, TxProcedureType } from "../txProcedure/types";
import type { AleoTxParams, AleoTxStatusResponse, AleoTxStep } from "./types";
import type { DialogTypeVariant } from "@/app/_contexts/UIContext/types";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  stakingOperatorUrlByNetwork,
  ALEO_PONDO_CORE_ID,
  ALEO_MTSP_ID,
  ALEO_PONDO_TOKEN_ID,
  defaultNetwork,
  isAleoTestnet,
} from "../../consts";
import {
  getAleoAddressUnbondingStatus,
  getAleoNativeStakedBalanceByAddress,
  getAleoWalletBalanceByAddress,
  getPAleoBalanceByAddress,
} from "./sdk";
import { getOperatorResponseQuery, setMonitorTxByAddress, setCoinbaseUserTracking } from "../stakingOperator/aleo";
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
  getTxResult,
  getAleoFromPAleo,
} from "./utils";
import { networkEndpoints, isAleoOnlyInstance } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { usePondoData } from "./pondo/hooks";
import { useDialog } from "@/app/_contexts/UIContext";
import { useSendingTransactions } from "@/app/_components/SendingTransactionsDialog";
import { getIsUserIdValid } from "@/app/_utils/aleoQuest";

const defaultChainId = isAleoTestnet ? "testnet" : "mainnet";

export const useAleoAddressStakedBalance = ({ network, address }: { network: Network | null; address?: string }) => {
  const { pAleoToAleoRate } = usePondoData() || {};
  const {
    data: nativeBalanceMicro,
    isLoading: isLoadingNativeBalanceMicro,
    isRefetching: isRefetchingNativeBalanceMicro,
    error: errorNativeBalanceMicro,
  } = useAleoNativeStakedBalanceByAddress({ address, network });
  const {
    data: pAleoMicroBalance,
    isLoading: isLoadingPAleoMicroBalance,
    isRefetching: isRefetchingPAleoMicroBalance,
    error: errorPAleoMicroBalance,
  } = usePAleoBalanceByAddress({ address, network });

  return {
    stakedBalance: getMicroCreditsToCredits(
      BigNumber(nativeBalanceMicro || 0)
        .plus(getAleoFromPAleo(pAleoMicroBalance || 0, pAleoToAleoRate || 1))
        .toNumber(),
    ).toString(),
    nativeBalance: getMicroCreditsToCredits(nativeBalanceMicro || 0).toString(),
    liquidBalance: getMicroCreditsToCredits(pAleoMicroBalance || 0).toString(),
    isLoading: isLoadingNativeBalanceMicro || isLoadingPAleoMicroBalance,
    isRefetching: isRefetchingNativeBalanceMicro || isRefetchingPAleoMicroBalance,
    error: errorNativeBalanceMicro || errorPAleoMicroBalance,
  };
};

export const useAleoWalletBalanceByAddress = ({
  address,
  network,
}: {
  address?: string | null;
  network: Network | null;
}) => {
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoAddressFormat = getIsAleoAddressFormat(address || "");
  const shouldEnable = isAleoNetwork && isAleoAddressFormat;

  const { data, error, isLoading, isRefetching } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoWalletBalanceByAddress", address, network],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getAleoWalletBalanceByAddress({
        apiUrl: networkEndpoints.aleo.rpc,
        address: address || "",
      });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return {
    data: getMicroCreditsToCredits(data || "0").toString(),
    isLoading,
    isRefetching,
    error,
  };
};

export const useAleoNativeStakedBalanceByAddress = ({
  address,
  network,
}: {
  address?: string;
  network: Network | null;
}) => {
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoAddressFormat = getIsAleoAddressFormat(address || "");
  const shouldEnable = isAleoNetwork && isAleoAddressFormat;

  const { data, error, isLoading, isRefetching } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoNativeBalanceByAddress", address, network],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getAleoNativeStakedBalanceByAddress({
        apiUrl: networkEndpoints.aleo.rpc,
        address: address || "",
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

export const useAleoAddressUnbondingStatus = ({
  address,
  network,
  stakingType,
}: {
  address?: string;
  network: Network | null;
  stakingType?: StakingType;
}) => {
  const { stakingType: defaultStakingType } = useShell();
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoAddressFormat = getIsAleoAddressFormat(address || "");
  const shouldEnable = isAleoNetwork && isAleoAddressFormat;

  const { data, error, isLoading } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoAddressUnbondingStatus", address, network, stakingType || defaultStakingType],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getAleoAddressUnbondingStatus({
        apiUrl: networkEndpoints.aleo.rpc,
        address: address || "",
        stakingType: stakingType || defaultStakingType,
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
    onReset: signStep.onReset,
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
  onReset,
}: AleoTxParams & AleoTxStep & { type: TxProcedureType; instantWithdrawal?: boolean }) => {
  const { operatorUrl } = broadcastTxMap[type];
  const { wallet: leoWallet } = useLeoWallet();
  const { stakingType } = useShell();
  const { pAleoToAleoRate, aleoToPAleoRate } = usePondoData() || {};
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const txMethodByWallet = useAleoTxMethodByWallet({ wallet, type });
  const castedNetwork = (isAleoNetwork ? network : "aleo") as AleoNetwork;
  const operatorResponseQuery = getOperatorResponseQuery({ type });
  const { sendingTransactions, setSendingTransactions } = useSendingTransactions();

  const searchParams = useSearchParams();
  const uuidParam = searchParams.get("userId");

  const { toggleOpen: toggleTxProcedureDialog } = useDialog(txProcedureMap[type] as DialogTypeVariant);
  const { toggleOpen: toggleSendingTransactionsDialog } = useDialog("sendingTransactions");
  // const { toggleOpen: toggleTxSentDialog } = useDialog("txSent");

  const aleoAddressUnbondingData = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network: network,
  });
  const txAmount =
    (type === "claim" && isAleoNetwork && stakingType === "liquid" ? aleoAddressUnbondingData?.amount : amount) || "";

  const { error, mutate, reset } = useMutation({
    mutationKey: ["aleoTx", type, txAmount, wallet, network, address, instantWithdrawal, uuidParam, isAleoTestnet],
    mutationFn: async () => {
      if (!address || !txMethodByWallet) {
        throw new Error("Failed to broadcast transaction: missing address or txMethodByWallet");
      }

      onPreparing?.();

      const { validatorAddress, uuid, txFee } = await operatorResponseQuery({
        apiUrl: `${stakingOperatorUrlByNetwork[castedNetwork]}${operatorUrl}`,
        address,
        amount: txAmount,
        stakingOption: stakingType as StakingType,
      });
      if (!uuid) {
        throw new Error("Failed to broadcast transaction: missing uuid");
      }

      onLoading?.();
      const txId = await txMethodByWallet({
        amount: txAmount,
        validatorAddress: validatorAddress || "",
        address,
        chainId: defaultChainId,
        txFee,
        pAleoToAleoRate: pAleoToAleoRate || 1,
        aleoToPAleoRate: aleoToPAleoRate || 1,
        instantWithdrawal,
      });

      onBroadcasting?.();

      const timestamp = Date.now();
      const newSendingTransactions: Array<SendingTransaction> = [
        {
          address,
          isAleoTestnet,
          network: network || defaultNetwork,
          stakingType: stakingType as StakingType,
          type,
          title: sendingTransactionsTitleMap[type][stakingType as StakingType],
          timestamp,
          txId,
          amount: txAmount,
          status: "pending",
        },
        ...sendingTransactions,
      ];

      // Coinbase Quest user tracking
      if (isAleoOnlyInstance && uuidParam && getIsUserIdValid(uuidParam)) {
        setCoinbaseUserTracking({
          apiUrl: stakingOperatorUrlByNetwork[network || "aleo"],
          address: address || "",
          transactionId: txId || "",
          userId: uuidParam,
        });
      }

      setSendingTransactions(newSendingTransactions);
      toggleSendingTransactionsDialog(true);
      // toggleTxSentDialog(true);
      toggleTxProcedureDialog(false);
      onReset?.();

      let txRes: AleoTxStatusResponse | undefined = undefined;

      txRes = await getTxResult({ txId, wallet, leoWallet, address });

      if (!!txRes?.status && txRes?.status !== "loading") {
        const status = txRes.status === "success" ? "success" : "failed";
        setSendingTransactions((prevTransactions) =>
          prevTransactions?.map((transaction) =>
            transaction.txId === txId ? { ...transaction, status } : transaction,
          ),
        );
      }

      if (!txRes || txRes.status === "error") {
        return {
          txId: txRes?.txId,
          uuid,
          isError: true,
          uuidParam,
        };
      }

      return {
        txId: txRes.txId || txId,
        uuid,
        amount,
        uuidParam,
      };
    },
    onSuccess: ({ txId, isError, amount, uuidParam }) => {
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
    if (type === "undelegate" || type === "instant_undelegate") return leoWalletUnstake;
    if (type === "claim") return leoWalletWithdraw;
  }
  if (wallet === "puzzle") {
    if (type === "delegate") return puzzleStake;
    if (type === "undelegate" || type === "instant_undelegate") return puzzleUnstake;
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
  const leoWalletBalance = useAleoWalletBalanceByAddress({ address, network });
  const puzzleBalance = usePuzzleBalance({ address });

  if (!activeWallet) return null;
  if (activeWallet === "leoWallet") return leoWalletBalance;
  if (activeWallet === "puzzle") return puzzleBalance;
  return null;
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
  instant_undelegate: {
    operatorUrl: "stake/user/undelegate",
  },
  claim: {
    operatorUrl: "stake/user/claim",
  },
  redelegate: {
    operatorUrl: "",
  },
};

const sendingTransactionsTitleMap: Record<TxProcedureType, Record<StakingType, string>> = {
  delegate: { native: "Stake (native)", liquid: "Stake (liquid)" },
  undelegate: { native: "Unstake (native)", liquid: "Unstake (liquid)" },
  instant_undelegate: { native: "Unstake (native)", liquid: "Unstake (liquid instant)" },
  claim: { native: "Withdraw (native)", liquid: "Withdraw (liquid)" },
  redelegate: { native: "Redelegate (native)", liquid: "Redelegate (liquid)" },
};

const txProcedureMap: Record<TxProcedureType, string> = {
  delegate: "stakingProcedure",
  undelegate: "unstakingProcedure",
  instant_undelegate: "unstakingProcedure",
  claim: "claimingProcedure",
  redelegate: "redelegatingProcedure",
};
