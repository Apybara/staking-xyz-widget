import type { WalletStates } from "../../../_contexts/WalletContext/types";
import type { AleoTxStatus } from "../types";
import type * as T from "./types";
import { useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useBalance, useConnect, useDisconnect } from "@puzzlehq/sdk";
import { usePuzzleStates as useGlobalPuzzleStates } from "@/app/_providers/Aleo/Puzzle/PuzzleStatesContext";
import { getPuzzleTxStatus, puzzleStake, puzzleUnstake, puzzleWithdraw } from ".";

export const usePuzzleStake = () => {
  const { account } = useAccount();

  return async ({ validatorAddress, amount, chainId }: T.PuzzleStakeProps) => {
    try {
      if (!validatorAddress || !amount || !account?.address) {
        const error = new Error("Staking fails: missing validatorAddress, address, or amount");
        throw error;
      }
      return await puzzleStake({ amount, validatorAddress, address: account.address, chainId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Staking fails");
      throw err;
    }
  };
};

export const usePuzzleUnstake = () => {
  return async ({ amount, chainId }: T.PuzzleUnstakeProps) => {
    try {
      if (!amount) {
        const error = new Error("Unstaking fails: missing stakeAmount");
        throw error;
      }

      return await puzzleUnstake({ amount, chainId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unstaking fails");
      throw err;
    }
  };
};

export const usePuzzleWithdraw = () => {
  return async ({ chainId }: T.PuzzleWithdrawProps) => {
    try {
      return await puzzleWithdraw({ chainId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Withdraw fails");
      throw err;
    }
  };
};

export const usePuzzleTxStatus = ({ txId }: { txId?: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["puzzleTxStatus", txId],
    queryFn: () => {
      if (!txId) return Promise.resolve(null);
      return getPuzzleTxStatus({ id: txId });
    },
    enabled: !!txId,
    refetchInterval: !!txId ? 10000 : false,
    refetchOnWindowFocus: true,
  });

  const txStatus: AleoTxStatus | null = useMemo(() => {
    if (!txId || data === null) return null;

    if (isLoading) return "loading";
    if (error || !data?.event?.status || data?.error) return "error";

    const { status } = data.event;
    if (status === "Creating") return "loading";
    if (status === "Pending") return "success";

    return "error";
  }, [data, error, isLoading, txId]);

  return {
    txStatus,
    data,
    isLoading,
    error,
  };
};

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
