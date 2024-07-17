import type { WalletStates } from "../../../_contexts/WalletContext/types";
import type * as T from "./types";
import { useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { useAccount, useBalance, useConnect, useDisconnect } from "@puzzlehq/sdk";
import { usePuzzleStates as useGlobalPuzzleStates } from "@/app/_providers/Aleo/Puzzle/PuzzleStatesContext";
import { puzzleStake, puzzleUnstake, puzzleWithdraw } from ".";

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
  return async ({ address, amount, chainId }: T.PuzzleUnstakeProps) => {
    try {
      if (!amount) {
        const error = new Error("Unstaking fails: missing stakeAmount");
        throw error;
      }

      return await puzzleUnstake({ address, amount, chainId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unstaking fails");
      throw err;
    }
  };
};

export const usePuzzleWithdraw = () => {
  return async ({ address, chainId }: T.PuzzleWithdrawProps) => {
    try {
      return await puzzleWithdraw({ address, chainId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Withdraw fails");
      throw err;
    }
  };
};

export const usePuzzleStates = () => {
  const { account } = useAccount();
  const { isConnected } = useConnect();
  const { connectionStatus, setStates } = useGlobalPuzzleStates();
  const { data: balance } = usePuzzleBalance({ address: account?.address || null }) || {};

  useEffect(() => {
    if (!isConnected || !account?.address || (isConnected && balance === undefined)) {
      setStates({ connectionStatus: "disconnected" });
    }
  }, [account?.address, isConnected, balance]);

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
  const { data: balance } = usePuzzleBalance({ address: account?.address || null }) || {};

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
    if (isConnected && account?.address && balance !== undefined) {
      setStates({ connectionStatus: "connected" });
    }
  }, [isConnected, account?.address, balance]);

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
