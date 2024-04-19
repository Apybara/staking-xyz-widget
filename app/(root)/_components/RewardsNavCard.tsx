"use client";
import { useWallet } from "../../_contexts/WalletContext";
import * as NavCard from "../_components/NavCard";

export const RewardsNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const isDisabled = connectionStatus !== "connected";

  return (
    <NavCard.Card
      {...props}
      page="rewards"
      disabled={isDisabled}
      endBox={{
        title: <NavCard.SecondaryText>Rewards</NavCard.SecondaryText>,
        value: <NavCard.PrimaryText>00.00 %</NavCard.PrimaryText>,
      }}
    />
  );
};
