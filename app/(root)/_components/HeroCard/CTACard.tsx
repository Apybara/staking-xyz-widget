import type { ReactNode } from "react";
import cn from "classnames";
import * as S from "./heroCard.css";

type CTACardProps = {
  topSubtitle?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
};

export const CTACard = ({ topSubtitle, title, subtitle }: CTACardProps) => (
  <div className={cn(S.ctaCard)}>
    {topSubtitle && <span className={cn(S.ctaCardTopSubtitle)}>{topSubtitle}</span>}
    {title && <span className={cn(S.title)}>{title}</span>}
    {subtitle && <span className={cn(S.subtitle)}>{subtitle}</span>}
  </div>
);
