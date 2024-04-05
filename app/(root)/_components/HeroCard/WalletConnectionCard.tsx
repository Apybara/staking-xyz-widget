"use client";
import cn from "classnames";
import { useDialog } from "../../../_contexts/UIContext";
import { useWallet } from "../../../_contexts/WalletContext";
import * as S from "./heroCard.css";

export const WalletConnectionCard = () => {
  const { connectionStatus } = useWallet();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");

  return (
    <button
      className={cn(S.card)}
      disabled={connectionStatus === "connecting"}
      onClick={() => {
        toggleWalletConnectionDialog(true);
      }}
    >
      <span className={cn(S.title)}>Connect wallet</span>
      <span className={cn(S.subtitle)}>and explore the best staking experience</span>
    </button>
  );
};
