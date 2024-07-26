import type { ReactNode } from "react";
import cn from "classnames";
import Image from "next/image";
import * as Dialog from "../Dialog";
import { Icon } from "../Icon";
import * as InfoCard from "../InfoCard";
import { MessageTag } from "../MessageTag";
import { LoadingSpinner } from "../LoadingSpinner";
import { type CTAButtonProps, CTAButton as BaseCTAButton } from "../CTAButton";
import StakeIcon from "./stakeIcon.svg";
import UnstakeIcon from "./unstakeIcon.svg";
import RedelegateIcon from "./redelegateIcon.svg";
import * as S from "./delegationDialog.css";
import { TxType } from "@/app/types";

export const Shell = ({ dialog, children }: ShellProps) => {
  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={cn(S.shell)}>{children}</Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};

export const TopBox = ({ title, type }: TopBoxProps) => {
  return (
    <div className={cn(S.topBox)}>
      <div className={cn(S.icons)}>
        <Icon name="circleCheck" size={40} />
        <Image src={iconMap[type]} width={40} height={40} alt="Assistive visual" />
      </div>
      <h2 className={cn(S.title)}>{title || titleMap[type]}</h2>
    </div>
  );
};

export const StepsBox = ({ children }: { children: ReactNode }) => {
  return (
    <InfoCard.Card>
      <InfoCard.Stack>{children}</InfoCard.Stack>
    </InfoCard.Card>
  );
};

export const StepItem = ({ state, successLabel, explorerLink, tooltip, children, onCancel }: StepItemProps) => {
  const hasExplorerLink = !!explorerLink;

  return (
    <InfoCard.StackItem className={S.item}>
      <InfoCard.TitleBox>
        <span className={cn(S.itemIcon({ checked: state === "success" }))}>
          <Icon name="circleCheck" size={14} />
        </span>
        <p className={cn(S.itemText({ highlighted: state !== "idle" }))}>{children}</p>
        {!!tooltip && tooltip}
      </InfoCard.TitleBox>
      <div className={cn(S.itemEndBox)}>
        {(state === "loading" || state === "preparing" || state === "broadcasting") && <LoadingSpinner size={14} />}

        {state === "error" &&
          (hasExplorerLink ? (
            <a href={explorerLink} target="_blank" rel="noopener noreferrer">
              <MessageTag className={S.explorerTag} variant="warning">
                Failed <Icon className={S.explorerTagIcon} name="externalLink" size={10} />
              </MessageTag>
            </a>
          ) : (
            <MessageTag className={S.explorerTag} variant="warning">
              Failed
            </MessageTag>
          ))}

        {state === "success" && !explorerLink && (
          <MessageTag className={S.explorerTag} variant="success">
            {successLabel}
          </MessageTag>
        )}
        {state === "success" && explorerLink && (
          <a href={explorerLink} target="_blank" rel="noopener noreferrer">
            <MessageTag className={S.explorerTag} variant="success">
              {successLabel} <Icon className={S.explorerTagIcon} name="externalLink" size={10} />
            </MessageTag>
          </a>
        )}
        {onCancel && state === "loading" && (
          <button onClick={onCancel} className={cn(S.cancelButton)}>
            <Icon name="cross" size={14} />
          </button>
        )}
      </div>
    </InfoCard.StackItem>
  );
};

export const CTAButton = (props: CTAButtonProps) => {
  return <BaseCTAButton variant="primary" {...props} />;
};

export const ResultButtons = ({
  onActivityButtonClick,
  onDismissButtonClick,
}: {
  onActivityButtonClick: () => void;
  onDismissButtonClick: () => void;
}) => {
  return (
    <div className={cn(S.resultButtons)}>
      <CTAButton
        variant="tertiary"
        onClick={() => {
          onDismissButtonClick();
          onActivityButtonClick();
        }}
      >
        View activity
      </CTAButton>
      <CTAButton variant="secondary" onClick={onDismissButtonClick}>
        OK
      </CTAButton>
    </div>
  );
};

const iconMap: Record<TopBoxProps["type"], string> = {
  stake: StakeIcon,
  unstake: UnstakeIcon,
  redelegate: RedelegateIcon,
  claim: UnstakeIcon,
  withdraw: UnstakeIcon,
};
const titleMap: Record<TopBoxProps["type"], string> = {
  stake: "Steps to stake",
  unstake: "Steps to unstake",
  redelegate: "Steps to import",
  claim: "Steps to claim",
  withdraw: "Steps to withdraw",
};

export type ShellProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  children: ReactNode;
};
export type TopBoxProps = {
  title?: string;
  type: TxType;
};
export type StepItemProps = {
  state: "idle" | "active" | "preparing" | "loading" | "broadcasting" | "success" | "error";
  successLabel?: string;
  explorerLink?: string;
  tooltip?: ReactNode;
  children: ReactNode;
  onCancel?: () => void;
};
