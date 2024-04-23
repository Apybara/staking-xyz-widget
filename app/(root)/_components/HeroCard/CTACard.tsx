import cn from "classnames";
import * as S from "./heroCard.css";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";

export const CTACard = () => {
  const networkReward = useNetworkReward();

  return (
    <div className={cn(S.ctaCard)}>
      <span className={cn(S.ctaCardTopSubtitle)}>You’re missing</span>
      <span className={cn(S.title)}>{networkReward?.rewards.percentage}% rewards</span>
      <span className={cn(S.subtitle)}>Also time to manage your staking</span>
    </div>
  );
};
