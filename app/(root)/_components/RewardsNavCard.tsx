"use client";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useWallet } from "../../_contexts/WalletContext";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "@/app/_components/Skeleton";

export const RewardsNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const networkReward = useNetworkReward();

  const isLoading = networkReward?.isLoading;
  const isDisabled = connectionStatus !== "connected" || isLoading;

  return (
    <NavCard.Card
      {...props}
      page="rewards"
      disabled={isDisabled}
      endBox={{
        title: (
          <NavCard.SecondaryText>{isLoading ? <Skeleton width={68} height={12} /> : "Rewards"}</NavCard.SecondaryText>
        ),
        value: (
          <NavCard.PrimaryText>
            {isLoading ? <Skeleton width={82} height={16} /> : `${networkReward?.rewards.percentage} %`}
          </NavCard.PrimaryText>
        ),
      }}
    />
  );
};
