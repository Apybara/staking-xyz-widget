import cn from "classnames";
import * as S from "./heroCard.css";
import { useNetworkReward } from "@/app/_services/stakingOperator/celestia/hooks";

export const CTACard = () => {
  const { rewards } = useNetworkReward();

  return (
    <div className={cn(S.ctaCard)}>
      <span className={cn(S.ctaCardTopSubtitle)}>You’re missing</span>
      <span className={cn(S.title)}>{rewards.percentage}% rewards</span>
      <span className={cn(S.subtitle)}>Also time to manage your staking</span>
    </div>
  );
};
