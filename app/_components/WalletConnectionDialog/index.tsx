"use client";
import type { WalletType } from "../../types";
import { useState } from "react";
import { useDialog } from "../../_contexts/UIContext";
import { useWidget } from "../../_contexts/WidgetContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_services/hooks";
import { useWalletConnectors } from "../../_services/wallet/hooks";
import { networkWalletInfos } from "../../consts";
import { RootWalletConnectionDialog } from "./RootWalletConnectionDialog";

export const WalletConnectionDialog = () => {
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const { isLoading, setIsLoading, error, setError } = useProceduralStates();

  const { network } = useWidget();
  const { walletsSupport, connectionStatus } = useWallet();
  const { open, toggleOpen } = useDialog("walletConnection");
  const connectors = useWalletConnectors();

  return (
    <RootWalletConnectionDialog
      dialog={{
        open: !!open,
        onOpenChange: () => {
          toggleOpen(!open);
        },
      }}
      wallets={networkWalletInfos[network || "celestia"].map((wallet) => ({
        ...wallet,
        isSupported: walletsSupport?.[wallet.id] || false,
        isConnecting: connectingWallet === wallet.id && connectionStatus === "connecting",
      }))}
      connection={{
        isLoading,
        error,
        onConnect: async (wallet) => {
          setConnectingWallet(wallet.id);
          setIsLoading(true);

          try {
            if (!connectors?.[wallet.id]) throw new Error("Connector not found");
            // @ts-ignore
            await connectors[wallet.id]();
          } catch (e) {
            console.error(e);
            setError(e as Error);
          } finally {
            setIsLoading(false);
          }
        },
      }}
    />
  );
};
