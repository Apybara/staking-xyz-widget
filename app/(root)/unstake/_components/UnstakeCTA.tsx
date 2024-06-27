"use client";
import type { UnstakingStates } from "../../../_contexts/UnstakingContext/types";
import { useDialog } from "../../../_contexts/UIContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import { type CTAButtonProps, CTAButton } from "../../../_components/CTAButton";

export const UnstakeCTA = () => {
  const { ctaState } = useUnstaking();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");
  const { toggleOpen: toggleUnstakingProcedureDialog } = useDialog("unstakingProcedure");

  return (
    <CTAButton
      state={buttonState[ctaState]}
      variant={buttonVariant[ctaState]}
      onClick={() => {
        if (ctaState === "disconnected") {
          toggleWalletConnectionDialog(true);
        }
        if (ctaState === "submittable") {
          toggleUnstakingProcedureDialog(true);
        }
      }}
    >
      {textMap[ctaState]}
    </CTAButton>
  );
};

const textMap: Record<UnstakingStates["ctaState"], string> = {
  empty: "Enter amount",
  invalid: "Invalid amount",
  ineligible: "Below minimum",
  insufficient: "Below minimum",
  exceeded: "Insufficient balance",
  aboveBalance: "Insufficient balance",
  bufferExceeded: "Insufficient amount for fees",
  disconnected: "Connect wallet",
  connecting: "Connecting",
  submittable: "Unstake",
};

const buttonState: Record<UnstakingStates["ctaState"], CTAButtonProps["state"]> = {
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

const buttonVariant: Record<UnstakingStates["ctaState"], CTAButtonProps["variant"]> = {
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
