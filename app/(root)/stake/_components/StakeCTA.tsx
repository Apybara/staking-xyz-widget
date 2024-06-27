"use client";
import type { StakingStates } from "../../../_contexts/StakingContext/types";
import { useDialog } from "../../../_contexts/UIContext";
import { useStaking } from "../../../_contexts/StakingContext";
import { type CTAButtonProps, CTAButton } from "../../../_components/CTAButton";
import { useShell } from "@/app/_contexts/ShellContext";

export const StakeCTA = () => {
  const { stakingType } = useShell();
  const { ctaState, inputState } = useStaking();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");
  const { toggleOpen: toggleStakingProcedureDialog } = useDialog("stakingProcedure");

  const hasStakingTypeError = inputState !== "empty" && inputState !== "valid";

  return (
    <CTAButton
      state={buttonState[ctaState]}
      variant={buttonVariant[ctaState]}
      onClick={() => {
        if (ctaState === "disconnected") {
          toggleWalletConnectionDialog(true);
        }
        if (ctaState === "submittable") {
          toggleStakingProcedureDialog(true);
        }
      }}
    >
      {stakingType ? (hasStakingTypeError ? "Please input a valid amount" : textMap[ctaState]) : textMap[ctaState]}
    </CTAButton>
  );
};

const textMap: Record<StakingStates["ctaState"], string> = {
  empty: "Enter amount",
  invalid: "Invalid amount",
  ineligible: "Below minimum",
  insufficient: "Below minimum",
  exceeded: "Insufficient balance",
  aboveBalance: "Insufficient balance",
  bufferExceeded: "Insufficient amount for fees",
  disconnected: "Connect wallet",
  connecting: "Connecting",
  submittable: "Stake",
};

const buttonState: Record<StakingStates["ctaState"], CTAButtonProps["state"]> = {
  empty: "disabled",
  invalid: "disabled",
  ineligible: "disabled",
  insufficient: "disabled",
  exceeded: "disabled",
  aboveBalance: "disabled",
  bufferExceeded: "disabled",
  disconnected: "default",
  connecting: "loading",
  submittable: "default",
};

const buttonVariant: Record<StakingStates["ctaState"], CTAButtonProps["variant"]> = {
  empty: "tertiary",
  invalid: "tertiary",
  ineligible: "tertiary",
  insufficient: "tertiary",
  exceeded: "tertiary",
  aboveBalance: "tertiary",
  bufferExceeded: "tertiary",
  disconnected: "primary",
  connecting: "primary",
  submittable: "primary",
};
