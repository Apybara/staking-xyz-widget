"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { walletsInfo, defaultNetwork } from "../../consts";
import { RootWalletCapsule } from "./RootWalletCapsule";

export const WalletCapsule = () => {
  const { network } = useShell();
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
      network={network || defaultNetwork}
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
