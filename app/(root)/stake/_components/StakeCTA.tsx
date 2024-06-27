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
      {stakingType ? (hasStakingTypeError ? validAmountText : textMap[ctaState]) : textMap[ctaState]}
    </CTAButton>
  );
};

const validAmountText = "Please input a valid amount";

const textMap: Record<StakingStates["ctaState"], string> = {
  empty: "Enter amount",
  invalid: validAmountText,
  insufficient: validAmountText,
  exceeded: validAmountText,
  bufferExceeded: validAmountText,
  disconnected: "Connect wallet",
  connecting: "Connecting",
  submittable: "Stake",
};

const buttonState: Record<StakingStates["ctaState"], CTAButtonProps["state"]> = {
  empty: "disabled",
  invalid: "disabled",
  insufficient: "disabled",
  exceeded: "disabled",
  bufferExceeded: "disabled",
  disconnected: "default",
  connecting: "loading",
  submittable: "default",
};

const buttonVariant: Record<StakingStates["ctaState"], CTAButtonProps["variant"]> = {
  empty: "tertiary",
  invalid: "tertiary",
  insufficient: "tertiary",
  exceeded: "tertiary",
  bufferExceeded: "tertiary",
  disconnected: "primary",
  connecting: "primary",
  submittable: "primary",
};
