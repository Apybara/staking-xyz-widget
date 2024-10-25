import type { ReactNode } from "react";
import type { ExpectedSearchParams } from "../../../types";
import cn from "classnames";
import Link from "next/link";
import { Icon } from "../../../_components/Icon";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import * as S from "./navCard.css";

export const PrimaryText = ({ children }: { children: ReactNode }) => {
  return <span className={cn(S.primaryText)}>{children}</span>;
};
export const SecondaryText = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <span className={cn(S.secondaryText, className)}>{children}</span>;
};
export const ValueTextBox = ({ children }: { children: ReactNode }) => {
  return <div className={cn(S.valueTextBox)}>{children}</div>;
};

export const Card = ({ disabled = false, searchParams, page, endBox }: NavCardProps) => {
  if (!disabled) {
    return (
      <Link href={getLinkWithSearchParams(searchParams, page)} className={cn(S.card)}>
        <div className={cn(S.main)}>
          <span className={cn(S.title)}>{pageTitleMap[page]}</span>
          <span className={cn(S.iconArrow)}>
            <Icon name="arrow" size={12} />
          </span>
        </div>
        <div className={cn(S.endBox)}>
          {endBox?.title}
          {endBox?.value}
        </div>
      </Link>
    );
  }
  return (
    <button className={cn(S.disabledCard)} disabled>
      <div className={cn(S.main)}>
        <span className={cn(S.title)}>{pageTitleMap[page]}</span>
      </div>
      <div className={cn(S.endBox)}>
        {endBox?.title}
        {endBox?.value}
      </div>
    </button>
  );
};

export type NavCardProps = {
  disabled?: boolean;
  searchParams: ExpectedSearchParams;
  page: "stake" | "unstake" | "rewards" | "activity";
  endBox?: {
    title: ReactNode;
    value: ReactNode;
  };
};
export type PageNavCardProps = Omit<NavCardProps, "page">;

const pageTitleMap = {
  stake: "Stake",
  unstake: "Unstake",
  rewards: "Rewards",
  activity: "Activity",
};
