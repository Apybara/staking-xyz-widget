"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWidget } from "../../_contexts/WidgetContext";
import { walletsInfo } from "../../consts";
import { RootWalletCapsule } from "./RootWalletCapsule";

export const WalletCapsule = () => {
  const { network } = useWidget();
  const { connectionStatus, activeWallet, address } = useWallet();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");
  const { toggleOpen: toggleWalletAccountDialog } = useDialog("walletAccount");

  return (
    <RootWalletCapsule
      state={connectionStatus === "disconnecting" ? "disconnected" : connectionStatus}
      wallet={
        activeWallet && address
          ? {
              info: walletsInfo[activeWallet],
              address,
            }
          : undefined
      }
      network={network || "celestia"}
      onButtonClick={() => {
        if (connectionStatus === "connected") {
          toggleWalletAccountDialog(true);
          return;
        }

        toggleWalletConnectionDialog(true);
      }}
    />
  );
};
