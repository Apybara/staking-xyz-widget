import type { ReactNode } from "react";
import type { RouterStruct } from "../../../types";
import cn from "classnames";
import Link from "next/link";
import { Icon } from "../../../_components/Icon";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import * as S from "./navCard.css";

export const Stake = (props: PageNavCardProps) => {
  return <NavCard {...props} page="stake" />;
};
export const Unstake = (props: PageNavCardProps) => {
  return <NavCard {...props} page="unstake" />;
};
export const Rewards = (props: PageNavCardProps) => {
  return <NavCard {...props} page="rewards" />;
};
export const Activity = (props: PageNavCardProps) => {
  return <NavCard {...props} page="activity" />;
};

export const PrimaryText = ({ children }: { children: ReactNode }) => {
  return <span className={cn(S.primaryText)}>{children}</span>;
};
export const SecondaryText = ({ children }: { children: ReactNode }) => {
  return <span className={cn(S.secondaryText)}>{children}</span>;
};
export const ValueTextBox = ({ children }: { children: ReactNode }) => {
  return <div className={cn(S.valueTextBox)}>{children}</div>;
};

const NavCard = ({ disabled = false, searchParams, page, endBox }: NavCardProps) => {
  if (!disabled) {
    return (
      <Link href={getLinkWithSearchParams(searchParams, page)} className={cn(S.card)}>
        <div className={cn(S.main)}>
          <span className={cn(S.title)}>{pageTitleMap[page]}</span>
          <Icon name="chevron" size={12} className={cn(S.icon, S.iconChevron)} />
          <Icon name="arrow" size={12} className={cn(S.icon, S.iconArrow)} />
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

type NavCardProps = {
  disabled?: boolean;
  searchParams: RouterStruct["searchParams"];
  page: "stake" | "unstake" | "rewards" | "activity";
  endBox?: {
    title: ReactNode;
    value: ReactNode;
  };
};
type PageNavCardProps = Omit<NavCardProps, "page">;

const pageTitleMap = {
  stake: "Stake",
  unstake: "Unstake",
  rewards: "Rewards",
  activity: "Activity",
};
