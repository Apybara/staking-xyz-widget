import type { ReactNode } from "react";
import cn from "classnames";
import { Icon } from "@/app/_components/Icon";

import * as S from "./more.css";

export type MoreNavCardProps = {
  title: ReactNode;
  description: ReactNode;
  url?: string;
};

export const MoreNavCard = ({ title, description, url }: MoreNavCardProps) => (
  <a href={url} className={S.card} target="_blank" rel="noreferrer">
    <div className={S.cardContent}>
      <h3 className={S.title}>{title}</h3>
      <span className={S.description}>{description}</span>
    </div>
    <div className={S.endBox}>
      <span className={cn(S.iconArrow)}>
        <Icon name="arrow" size={12} />
      </span>
    </div>
  </a>
);
