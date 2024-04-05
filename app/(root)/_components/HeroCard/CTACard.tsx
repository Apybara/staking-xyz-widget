import cn from "classnames";
import * as S from "./heroCard.css";

export const CTACard = () => {
  return (
    <div className={cn(S.ctaCard)}>
      <span className={cn(S.ctaCardTopSubtitle)}>You’re missing</span>
      <span className={cn(S.title)}>00.00% rewards</span>
      <span className={cn(S.subtitle)}>Also time to manage your staking</span>
    </div>
  );
};
