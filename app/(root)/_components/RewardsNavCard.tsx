"use client";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useWallet } from "../../_contexts/WalletContext";
import * as NavCard from "../_components/NavCard";

export const RewardsNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const networkReward = useNetworkReward();

  const isDisabled = connectionStatus !== "connected";

  return (
    <NavCard.Card
      {...props}
      page="rewards"
      disabled={isDisabled}
      endBox={{
        title: <NavCard.SecondaryText>Rewards</NavCard.SecondaryText>,
        value: <NavCard.PrimaryText>{networkReward?.rewards.percentage} %</NavCard.PrimaryText>,
      }}
    />
  );
};
