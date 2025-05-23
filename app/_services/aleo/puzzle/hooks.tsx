import type { WalletStates } from "../../../_contexts/WalletContext/types";
import type * as T from "./types";
import { useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { useAccount, useBalance, useConnect, useDisconnect, Network } from "@puzzlehq/sdk";
import { usePuzzleStates as useGlobalPuzzleStates } from "@/app/_providers/Aleo/Puzzle/PuzzleStatesContext";
import {
  puzzleLiquidStake,
  puzzleLiquidUnstake,
  puzzleLiquidWithdraw,
  puzzleStake,
  puzzleUnstake,
  puzzleWithdraw,
} from ".";
import { useShell } from "@/app/_contexts/ShellContext";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_IMAGE, SITE_WALLET_CONNECT_LOGO } from "@/app/consts";
export const usePuzzleStake = () => {
  const { stakingType } = useShell();
  const { account } = useAccount();

  const stakingFunction = stakingType === "liquid" ? puzzleLiquidStake : puzzleStake;

  return async ({ validatorAddress, amount, chainId, txFee, aleoToPAleoRate }: T.PuzzleStakeProps) => {
    try {
      if (!amount || !account?.address) {
        const error = new Error("Staking fails: missing validatorAddress, address, or amount");
        throw error;
      }
      return await stakingFunction({
        amount,
        validatorAddress,
        address: account.address,
        chainId,
        txFee,
        aleoToPAleoRate,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Staking fails");
      throw err;
    }
  };
};

export const usePuzzleUnstake = () => {
  const { stakingType } = useShell();

  const unstakingFunction = stakingType === "liquid" ? puzzleLiquidUnstake : puzzleUnstake;

  return async ({ address, amount, chainId, txFee, pAleoToAleoRate, instantWithdrawal }: T.PuzzleUnstakeProps) => {
    try {
      if (!amount) {
        const error = new Error("Unstaking fails: missing stakeAmount");
        throw error;
      }

      return await unstakingFunction({ address, amount, chainId, txFee, pAleoToAleoRate, instantWithdrawal });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unstaking fails");
      throw err;
    }
  };
};

export const usePuzzleWithdraw = () => {
  const { stakingType } = useShell();

  const withdrawFunction = stakingType === "liquid" ? puzzleLiquidWithdraw : puzzleWithdraw;

  return async ({ address, chainId, txFee, amount }: T.PuzzleWithdrawProps) => {
    try {
      return await withdrawFunction({ address, chainId, txFee, amount });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Withdraw fails");
      throw err;
    }
  };
};

const usePuzzleConnect = () => {
  return useConnect({
    dAppInfo: {
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      iconUrl: SITE_WALLET_CONNECT_LOGO,
    },
    permissions: {
      programIds: {
        [Network.AleoMainnet]: [process.env.NEXT_PUBLIC_ALEO_PONDO_CORE_ID || ""],
        [Network.AleoTestnet]: [process.env.NEXT_PUBLIC_ALEOTESTNET_PONDO_CORE_ID || ""],
      },
    },
  });
};

export const usePuzzleStates = () => {
  const { account } = useAccount();
  const { isConnected } = usePuzzleConnect();
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
  const { isConnected, connect: puzzleConnect } = usePuzzleConnect();
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
  const { isConnected } = usePuzzleConnect();
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
