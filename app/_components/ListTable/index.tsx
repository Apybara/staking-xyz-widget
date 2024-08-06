import type { ReactNode } from "react";
import cn from "classnames";
import { Icon } from "../Icon";
import { LoadingSpinner } from "../LoadingSpinner";
import { type TabButtonProps, TabButton } from "../TabButton";
import * as S from "./listTable.css";
import { Network } from "@/app/types";

export type TabsProps = {
  tabs: Array<TabButtonProps>;
};
export const Tabs = ({ tabs }: TabsProps) => {
  return (
    <div className={cn(S.tabs)}>
      {tabs.map((tab, index) => (
        <TabButton key={index} {...tab} />
      ))}
    </div>
  );
};

export type PadProps = {
  className?: string;
  children: ReactNode;
};
export const Pad = ({ className, children }: PadProps) => {
  return <div className={cn(S.pad, className)}>{children}</div>;
};

export type ListProps = {
  children: ReactNode;
};
export const List = ({ children }: ListProps) => {
  return <ul className={cn(S.list)}>{children}</ul>;
};

export type ItemProps = {
  children: ReactNode;
};
export const Item = ({ children }: ItemProps) => {
  return <li className={cn(S.item)}>{children}</li>;
};
export const ExternalLinkItemWrapper = ({ children, href }: { children: ReactNode; href?: string }) => {
  if (!href) return <>{children}</>;

  return (
    <a className={S.item} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export type TxInfoPrimaryProps = {
  title: string;
  externalLink?: boolean;
  isProcessing?: boolean;
  isSuccess?: boolean;
  amount?: string;
  network?: Network | null;
};
export const TxInfoPrimary = ({
  title,
  externalLink,
  isProcessing,
  isSuccess,
  amount,
  network,
}: TxInfoPrimaryProps) => {
  return (
    <div
      className={cn(
        S.txInfoPrimary({
          isInactive: isProcessing || isSuccess === false,
          isAleoProcessing: isProcessing && network === "aleo",
        }),
      )}
    >
      <div className={cn(S.txInfoPrimaryStart)}>
        {isProcessing && <LoadingSpinner className={S.txInfoLoadingIcon} size={12} />}
        {!isProcessing && isSuccess !== undefined && (
          <Icon
            className={S.txInfoResultIcon({ type: isSuccess ? "success" : "fail" })}
            name={isSuccess ? "circleCheck" : "circleCross"}
            size={14}
          />
        )}

        <div className={S.txInfoPrimaryChild}>
          <h5 className={cn(S.txInfoPrimaryTitle)}>{title}</h5>
          {externalLink && (
            <span className={S.txInfoLinkIcon}>
              <Icon name="externalLink" size={10} />
            </span>
          )}
        </div>
      </div>
      {amount && <p className={cn(S.txInfoPrimaryAmount)}>{amount}</p>}
    </div>
  );
};

export type TxInfoSecondaryProps = {
  time: string;
  reward?: string;
  isProcessing?: boolean;
  network?: Network | null;
};
export const TxInfoSecondary = ({ time, reward, isProcessing, network }: TxInfoSecondaryProps) => {
  return (
    <div className={cn(S.txInfoSecondary({ isProcessing, isAleoProcessing: isProcessing && network === "aleo" }))}>
      <time className={cn(S.txInfoSecondaryValue)}>{time}</time>
      {reward && <p className={cn(S.txInfoSecondaryValue)}>{reward}</p>}
    </div>
  );
};

export type PaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  onNextClick: () => void;
  onFirstClick: () => void;
  onPrevClick: () => void;
  onLastClick: () => void;
};
export const Pagination = ({
  currentPage,
  hasNextPage,
  onNextClick,
  onFirstClick,
  onPrevClick,
  onLastClick,
}: PaginationProps) => {
  const isBackwardActive = currentPage > 1;
  const isForwardActive = hasNextPage;

  return (
    <nav className={cn(S.pagination)}>
      <ul className={cn(S.paginationList)}>
        <li>
          <button
            className={cn(
              S.paginationButton({ state: isBackwardActive ? "active" : "inactive", direction: "backward" }),
            )}
            onClick={onFirstClick}
            disabled={!isBackwardActive}
          >
            <Icon name="forward" size={10} />
          </button>
        </li>
        <li>
          <button
            className={cn(
              S.paginationButton({ state: isBackwardActive ? "active" : "inactive", direction: "backward" }),
            )}
            onClick={onPrevClick}
            disabled={!isBackwardActive}
          >
            <Icon name="chevron" size={10} />
          </button>
        </li>
        <li className={cn(S.paginationPage)}>{currentPage}</li>
        <li>
          <button
            className={cn(S.paginationButton({ state: isForwardActive ? "active" : "inactive", direction: "forward" }))}
            onClick={onNextClick}
            disabled={!isForwardActive}
          >
            <Icon name="chevron" size={10} />
          </button>
        </li>
        <li>
          <button
            className={cn(S.paginationButton({ state: isForwardActive ? "active" : "inactive", direction: "forward" }))}
            onClick={onLastClick}
            disabled={!isForwardActive}
          >
            <Icon name="forward" size={10} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
