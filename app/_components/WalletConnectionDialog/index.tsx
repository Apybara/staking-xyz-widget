"use client";
import type { AleoWalletType, WalletType } from "../../types";
import { useEffect, useState } from "react";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_utils/hooks";
import { useCosmosKitError } from "../../_services/cosmos/cosmosKit/hooks";
import { useLeoWalletConnectError } from "@/app/_services/aleo/leoWallet/hooks";
import { useWalletConnectors, useWalletDisconnectors } from "../../_services/wallet/hooks";
import { usePostHogEvent } from "../../_services/postHog/hooks";
import { networkWalletInfos, defaultNetwork } from "../../consts";
import { RootWalletConnectionDialog } from "./RootWalletConnectionDialog";

export const WalletConnectionDialog = () => {
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const { error, setError } = useProceduralStates();

  const { network, isOnMobileDevice } = useShell();
  const { walletsSupport, connectionStatus, activeWallet, isEagerlyConnecting, keplrSuggestConnectError, setStates } =
    useWallet();
  const { open, toggleOpen } = useDialog("walletConnection");
  const connectors = useWalletConnectors();
  const disconnectors = useWalletDisconnectors();
  // const cosmosKitConnectionError = useCosmosKitError({
  //   network,
  //   modalOpen: open,
  //   walletType: connectingWallet,
  //   keplrSuggestConnectError,
  // });
  const leoWalletConnectError = useLeoWalletConnectError();

  // Success connection event is tracked in WalletContext
  const captureWalletConnectFailed = usePostHogEvent("wallet_connect_failed");

  // Eager connection states
  useEffect(() => {
    if (isEagerlyConnecting) {
      toggleOpen(true);
      setError(null);
      setConnectingWallet(activeWallet);
    }
  }, [isEagerlyConnecting]);

  // Close the dialog when connected
  useEffect(() => {
    if (open && connectionStatus === "connected") {
      if (isEagerlyConnecting) {
        toggleOpen(false);
        return;
      }

      setTimeout(() => {
        toggleOpen(false);
      }, 800);
    }
  }, [open, connectionStatus, isEagerlyConnecting]);

  // This is a hacky handling of the connection error with CosmosKit and LeoWallet
  // because both don't throw errors from the `connect` methods.
  useEffect(() => {
    if (connectionStatus === "connecting") return;
    if (open && leoWalletConnectError && connectingWallet) {
      setError(new Error(`Failed to connect to ${connectingWallet}`));
      captureWalletConnectFailed({ wallet: connectingWallet, address: "" });
    }
  }, [open, leoWalletConnectError, connectingWallet, connectionStatus]);

  return (
    <RootWalletConnectionDialog
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (open && connectionStatus === "connecting") {
            return;
          }

          if (open) {
            setError(null);
            setConnectingWallet(null);
          }
          toggleOpen(!open);
        },
      }}
      wallets={networkWalletInfos[network || defaultNetwork].map((wallet) => ({
        ...wallet,
        isSupported: walletsSupport?.[wallet.id] || false,
        isConnecting: connectingWallet === wallet.id && connectionStatus === "connecting",
        isConnected: activeWallet === wallet.id && connectionStatus === "connected",
      }))}
      connection={{
        isLoading: connectingWallet !== null && connectionStatus === "connecting",
        error:
          connectionStatus !== "connecting" && error && connectingWallet
            ? {
                walletId: connectingWallet,
                message: error.message,
              }
            : undefined,
        onConnect: async (wallet) => {
          setConnectingWallet(wallet.id);
          setError(null);

          try {
            if (!connectors?.[wallet.id as AleoWalletType]) throw new Error("Connector not found");
            // @ts-ignore
            await connectors[wallet.id]();
            setError(null);
          } catch (e) {
            setError(e as Error);
            captureWalletConnectFailed({ wallet: wallet.id, address: "" });
          }
        },
      }}
      isOnMobileDevice={isOnMobileDevice}
      onCancelConnection={(wallet) => {
        if (!wallet || !disconnectors?.[wallet.id as AleoWalletType]) throw new Error("Disconnector not found");
        disconnectors[wallet.id as AleoWalletType]?.();
        setStates({ connectionStatus: "disconnected" });
      }}
    />
  );
};
