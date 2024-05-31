import type { ReactNode } from "react";
import cn from "classnames";
import * as S from "./heroCard.css";

type CTACardProps = {
  topSubtitle?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  tooltip?: ReactNode;
};

export const CTACard = ({ topSubtitle, title, subtitle, tooltip }: CTACardProps) => (
  <div className={cn(S.ctaCard)}>
    {topSubtitle && (
      <div className={cn(S.ctaCardTopSubtitle)}>
        <span>{topSubtitle}</span>
        {!!tooltip && tooltip}
      </div>
    )}
    {title && <span className={cn(S.title)}>{title}</span>}
    {subtitle && <span className={cn(S.subtitle)}>{subtitle}</span>}
  </div>
);
