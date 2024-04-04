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
import * as S from "./delegationDialog.css";

export const Shell = ({ dialog, children }: ShellProps) => {
  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={cn(S.shell)}>{children}</Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};

export const TopBox = ({ type }: TopBoxProps) => {
  return (
    <div className={cn(S.topBox)}>
      <div className={cn(S.icons)}>
        <Icon name="check" size={40} />
        <Image src={iconMap[type]} width={40} height={40} alt="Assistive visual" />
      </div>
      <h2 className={cn(S.title)}>{titleMap[type]}</h2>
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

export const StepItem = ({ state, explorerUrl, children }: StepItemProps) => {
  return (
    <InfoCard.StackItem>
      <InfoCard.TitleBox>
        <span className={cn(S.itemIcon({ checked: state === "success" }))}>
          <Icon name="check" size={14} />
        </span>
        <p className={cn(S.itemText({ highlighted: state !== "idle" }))}>{children}</p>
      </InfoCard.TitleBox>
      {state === "loading" && <LoadingSpinner size={14} />}
      {state === "error" && <MessageTag variant="warning">Failed</MessageTag>}
      {explorerUrl && state === "success" && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="external-link" size={14} />
        </a>
      )}
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
      <CTAButton variant="tertiary" onClick={onActivityButtonClick}>
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
};
const titleMap: Record<TopBoxProps["type"], string> = {
  stake: "Steps to stake",
  unstake: "Steps to unstake",
};

export type ShellProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  children: ReactNode;
};
export type TopBoxProps = {
  type: "stake" | "unstake";
};
export type StepItemProps = {
  state: "idle" | "active" | "loading" | "success" | "error";
  explorerUrl?: string;
  children: ReactNode;
};
