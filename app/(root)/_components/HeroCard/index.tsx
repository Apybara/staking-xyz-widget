"use client";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useWallet } from "../../../_contexts/WalletContext";
import { CTACard } from "./CTACard";
import { WalletConnectionCard } from "./WalletConnectionCard";

export const HeroCard = () => {
  const { connectionStatus } = useWallet();
  const networkReward = useNetworkReward();

  if (connectionStatus === "connected") {
    return (
      <CTACard
        topSubtitle="You’re missing"
        title={`${networkReward?.rewards.percentage}% rewards`}
        subtitle="Also time to manage your staking"
      />
    );
  }
  return <WalletConnectionCard />;
};
