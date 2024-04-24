import type { ReactNode } from "react";
import type { RouterStruct } from "../../../types";
import cn from "classnames";
import Link from "next/link";
import { Icon } from "../../../_components/Icon";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import * as S from "./navCard.css";

export const PrimaryText = ({ children }: { children: ReactNode }) => {
  return <span className={cn(S.primaryText)}>{children}</span>;
};
export const SecondaryText = ({ children }: { children: ReactNode }) => {
  return <span className={cn(S.secondaryText)}>{children}</span>;
};
export const ValueTextBox = ({ children }: { children: ReactNode }) => {
  return <div className={cn(S.valueTextBox)}>{children}</div>;
};

const CardWrapper = ({
  disabled,
  searchParams,
  page,
  externalUrl,
  children,
}: NavCardProps & { children: ReactNode }) => {
  if (disabled) {
    return (
      <button className={S.disabledCard} disabled>
        {children}
      </button>
    );
  }

  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noreferrer" className={S.card}>
        {children}
      </a>
    );
  }

  return (
    <Link href={getLinkWithSearchParams(searchParams, page || "#")} className={S.card}>
      {children}
    </Link>
  );
};

const CardLinkArrow = () => (
  <>
    <Icon name="chevron" size={12} className={cn(S.icon, S.iconChevron)} />
    <Icon name="arrow" size={12} className={cn(S.icon, S.iconArrow)} />
  </>
);

export const Card = (props: NavCardProps) => {
  const { disabled = false, page, title, description, arrowPosition = "left", endBox } = props;

  return (
    <CardWrapper {...props}>
      <div className={S.main}>
        <div className={S.mainContent}>
          <span className={S.title}>{page ? pageTitleMap[page] : title}</span>
          {description && <span className={S.description}>{description}</span>}
        </div>
        {!disabled && arrowPosition === "left" && <CardLinkArrow />}
      </div>
      <div className={S.endBox}>
        {!disabled && arrowPosition === "right" ? (
          <CardLinkArrow />
        ) : (
          <>
            {endBox?.title}
            {endBox?.value}
          </>
        )}
      </div>
    </CardWrapper>
  );
};

export type NavCardProps = {
  disabled?: boolean;
  searchParams: RouterStruct["searchParams"];
  page?: "stake" | "unstake" | "rewards" | "activity";
  title?: ReactNode;
  description?: ReactNode;
  externalUrl?: string;
  arrowPosition?: "left" | "right";
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
