import type { WalletName } from "@demox-labs/aleo-wallet-adapter-base";
import type { WalletStates } from "../../../_contexts/WalletContext/types";
import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "use-local-storage";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";

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
