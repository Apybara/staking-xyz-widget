import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { AleoWalletType, AleoNetwork } from "../../types";
import {
  useIsLeoWalletInstalled,
  useLeoWalletStates,
  useLeoWalletConnector,
  useLeoWalletDisconnector,
  useLeoWalletHasStoredConnection,
} from "./leoWallet/hooks";
import {
  usePuzzleStates,
  usePuzzleConnector,
  usePuzzleDisconnector,
  usePuzzleBalance,
  usePuzzleHasStoredConnection,
} from "./puzzle/hooks";
import { getMicroCreditsToCredits } from "./utils";

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
