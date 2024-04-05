"use client";
import { useWallet } from "../../../_contexts/WalletContext";
import { CTACard } from "./CTACard";
import { WalletConnectionCard } from "./WalletConnectionCard";

export const HeroCard = () => {
  const { connectionStatus } = useWallet();

  if (connectionStatus === "connected") {
    return <CTACard />;
  }
  return <WalletConnectionCard />;
};
