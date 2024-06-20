import type { WalletStates } from "../../../_contexts/WalletContext/types";
import { useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { useAccount, useBalance, useConnect, useDisconnect } from "@puzzlehq/sdk";
import { usePuzzleStates as useGlobalPuzzleStates } from "@/app/_providers/Aleo/Puzzle/PuzzleStatesContext";

export const usePuzzleStates = () => {
  const { account } = useAccount();
  const { isConnected } = useConnect();
  const { connectionStatus, setStates } = useGlobalPuzzleStates();

  useEffect(() => {
    if (!isConnected || !account?.address) {
      setStates({ connectionStatus: "disconnected" });
    }
  }, [account?.address, isConnected]);

  return useMemo(
    () => ({
      activeWallet: "puzzle" as WalletStates["activeWallet"],
      connectionStatus,
      address: account?.address || null,
    }),
    [account?.address, connectionStatus],
  );
};

export const usePuzzleConnector = () => {
  const { setStates } = useGlobalPuzzleStates();
  const { account } = useAccount();
  const { isConnected, connect: puzzleConnect } = useConnect();

  const connect = useCallback(async () => {
    setStates({ connectionStatus: "connecting" });
    try {
      await puzzleConnect();
      setStates({ connectionStatus: "connected" });
    } catch (error) {
      setStates({ connectionStatus: "disconnected" });
      console.error(error);
      throw error;
    }
  }, [puzzleConnect]);

  useEffect(() => {
    if (isConnected && account?.address) {
      setStates({ connectionStatus: "connected" });
    }
  }, [isConnected, account?.address]);

  return connect;
};

export const usePuzzleDisconnector = () => {
  const { setStates } = useGlobalPuzzleStates();
  const { disconnect: puzzleDisconnect } = useDisconnect();

  const disconnect = useCallback(async () => {
    setStates({ connectionStatus: "disconnecting" });
    try {
      await puzzleDisconnect();
      setStates({ connectionStatus: "disconnected" });
    } catch (error) {
      setStates({ connectionStatus: "connected" });
      console.error(error);
      throw error;
    }
  }, [puzzleDisconnect]);

  return disconnect;
};

export const usePuzzleBalance = ({ address }: { address: string | null }) => {
  const { isConnected } = useConnect();
  const { balances, loading, error } = useBalance({ address: address || undefined });

  if (!address || !isConnected || !balances?.[0]?.values) return null;
  return {
    isLoading: loading,
    error: error && new Error(error || "Failed to fetch Puzzle balance"),
    data: balances[0].values.public.toString(),
  };
};

export const usePuzzleHasStoredConnection = () => {
  const [puzzleStorage] = useLocalStorage<{
    state?: any;
  }>("puzzle-wallet-store", { state: null });

  return !!puzzleStorage?.state;
};
