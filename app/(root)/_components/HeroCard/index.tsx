"use client";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { Skeleton } from "@/app/_components/Skeleton";
import { useWallet } from "../../../_contexts/WalletContext";
import { CTACard } from "./CTACard";
import { WalletConnectionCard } from "./WalletConnectionCard";

export const HeroCard = () => {
  const { connectionStatus } = useWallet();
  const networkReward = useNetworkReward();

  const isLoading = networkReward?.isLoading;

  if (connectionStatus === "connected") {
    return (
      <CTACard
        topSubtitle="You’re missing"
        title={isLoading ? <Skeleton width={180} height={20} /> : `${networkReward?.rewards.percentage}% rewards`}
        subtitle="Also time to manage your staking"
      />
    );
  }
  return <WalletConnectionCard />;
};
