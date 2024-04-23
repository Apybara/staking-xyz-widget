"use client";
import { useNetworkReward } from "@/app/_services/stakingOperator/celestia/hooks";
import { useWallet } from "../../_contexts/WalletContext";
import * as NavCard from "../_components/NavCard";

export const RewardsNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const { rewards } = useNetworkReward();
  
  const isDisabled = connectionStatus !== "connected";

  return (
    <NavCard.Card
      {...props}
      page="rewards"
      disabled={isDisabled}
      endBox={{
        title: <NavCard.SecondaryText>Rewards</NavCard.SecondaryText>,
        value: <NavCard.PrimaryText>{rewards.percentage} %</NavCard.PrimaryText>,
      }}
    />
  );
};
