"use client";
import type { WalletType } from "../../types";
import { useEffect, useState } from "react";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_utils/hooks";
import { useCosmosKitError } from "../../_services/cosmos/cosmosKit/hooks";
import { useWalletConnectors } from "../../_services/wallet/hooks";
import { networkWalletInfos } from "../../consts";
import { RootWalletConnectionDialog } from "./RootWalletConnectionDialog";

export const WalletConnectionDialog = () => {
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const { error, setError } = useProceduralStates();

  const { network, isOnMobileDevice } = useShell();
  const { walletsSupport, connectionStatus, activeWallet, isEagerlyConnecting, setStates } = useWallet();
  const { open, toggleOpen } = useDialog("walletConnection");
  const connectors = useWalletConnectors(network || "celestia");
  const cosmosKitConnectionError = useCosmosKitError({ network, modalOpen: open, walletType: connectingWallet });

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

  // This is a hacky handling of the connection error with CosmosKit
  // because CosmosKit doesn't throw an error from the `connect` method.
  useEffect(() => {
    if (connectionStatus === "connecting") return;
    if (open && cosmosKitConnectionError && connectingWallet) {
      setError(new Error(`Failed to connect to ${connectingWallet}`));
    }
  }, [open, cosmosKitConnectionError, connectingWallet, connectionStatus]);

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
      wallets={networkWalletInfos[network || "celestia"].map((wallet) => ({
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
            if (!connectors?.[wallet.id]) throw new Error("Connector not found");
            // @ts-ignore
            await connectors[wallet.id]();
          } catch (e) {
            console.error(e);
            setError(e as Error);
          }
        },
      }}
      isOnMobileDevice={isOnMobileDevice}
      onCancelConnection={() => setStates({ connectionStatus: "disconnected" })}
    />
  );
};
