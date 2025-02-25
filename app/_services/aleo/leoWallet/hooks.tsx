import type { WalletName } from "@demox-labs/aleo-wallet-adapter-base";
import type * as T from "./types";
import type { WalletStates } from "../../../_contexts/WalletContext/types";
import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "use-local-storage";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  leoWalletLiquidStake,
  leoWalletLiquidUnstake,
  leoWalletLiquidWithdraw,
  leoWalletStake,
  leoWalletUnstake,
  leoWalletWithdraw,
} from ".";
import { useShell } from "@/app/_contexts/ShellContext";

export const useLeoWalletStake = () => {
  const { stakingType } = useShell();
  const { wallet, publicKey } = useLeoWallet();

  const stakingFunction = stakingType === "liquid" ? leoWalletLiquidStake : leoWalletStake;

  return async ({
    validatorAddress,
    amount,
    chainId,
    txFee,
    aleoToPAleoRate,
  }: Omit<T.LeoWalletStakeProps, "wallet" | "address">) => {
    try {
      if (!publicKey || !wallet || !amount) {
        const error = new Error("Staking fails: missing wallet, publicKey, validatorAddress or amount");
        throw error;
      }
      return await stakingFunction({
        amount,
        validatorAddress,
        wallet,
        address: publicKey,
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

export const useLeoWalletUnstake = () => {
  const { stakingType } = useShell();
  const { wallet, publicKey } = useLeoWallet();

  const unstakingFunction = stakingType === "liquid" ? leoWalletLiquidUnstake : leoWalletUnstake;

  return async ({
    amount,
    chainId,
    txFee,
    pAleoToAleoRate,
    instantWithdrawal,
  }: Omit<T.LeoWalletUnstakeProps, "wallet" | "address">) => {
    try {
      if (!publicKey || !wallet || !amount) {
        const error = new Error("Unstaking fails: missing wallet, publicKey, or stakeAmount");
        throw error;
      }

      return await unstakingFunction({
        amount,
        wallet,
        address: publicKey,
        chainId,
        txFee,
        pAleoToAleoRate,
        instantWithdrawal,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unstaking fails");
      throw err;
    }
  };
};

export const useLeoWalletWithdraw = () => {
  const { stakingType } = useShell();
  const { wallet, publicKey } = useLeoWallet();

  const withdrawFunction = stakingType === "liquid" ? leoWalletLiquidWithdraw : leoWalletWithdraw;

  return async ({ chainId, txFee, amount }: Omit<T.LeoWalletWithdrawProps, "wallet" | "address">) => {
    try {
      if (!publicKey || !wallet) {
        const error = new Error("Withdraw fails: missing wallet or publicKey");
        throw error;
      }

      return await withdrawFunction({ wallet, address: publicKey, chainId, txFee, amount });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Withdraw fails");
      throw err;
    }
  };
};

export const useLeoWalletStates = () => {
  const { connecting, connected, disconnecting, publicKey } = useLeoWallet();

  const connectionStatus: WalletStates["connectionStatus"] = useMemo(() => {
    if (connecting) return "connecting";
    if (connected) return "connected";
    if (disconnecting) return "disconnecting";
    return "disconnected";
  }, [connecting, connected, disconnecting, publicKey]);

  return {
    activeWallet: "leoWallet" as WalletStates["activeWallet"],
    address: publicKey,
    connectionStatus,
  };
};

export const useLeoWalletConnector = () => {
  const { select } = useLeoWallet();

  return async () => {
    await select("Leo Wallet" as WalletName);
    Promise.resolve();
  };
};

export const useLeoWalletDisconnector = () => {
  const { disconnect, select } = useLeoWallet();

  return async () => {
    await disconnect();
    await select("" as WalletName);
    Promise.resolve();
  };
};

// Vince:
// Because Aleo wallet doesn't expose any connection errors (e.g. user rejected connection, user closed modal, etc.),
// we have to manually monitor connection disruption events.
// This is of course hacky, but Aleo wallet should expose connection errors in the future.
export const useLeoWalletConnectError = () => {
  const { connected, connecting } = useLeoWallet();
  const [wasConnecting, setWasConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setWasConnecting(connecting);
    if (connecting) setHasError(false);
  }, [connecting]);

  useEffect(() => {
    if (wasConnecting && !connected && !connecting) {
      setHasError(true);
      return;
    }
  }, [wasConnecting, connected, connecting]);

  return hasError;
};

export const useIsLeoWalletInstalled = () => {
  const { wallets } = useLeoWallet();
  const leoWallet = wallets.find((wallet) => wallet.adapter.name === "Leo Wallet");

  if (!leoWallet) return false;
  if (leoWallet.readyState !== "Installed") return false;
  return true;
};

export const useLeoWalletHasStoredConnection = () => {
  const [leoWalletName] = useLocalStorage<string | undefined>("walletName", undefined);
  return leoWalletName === "Leo Wallet";
};
