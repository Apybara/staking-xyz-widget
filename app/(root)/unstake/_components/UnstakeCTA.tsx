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

const validAmountText = "Please input a valid amount";

const textMap: Record<UnstakingStates["ctaState"], string> = {
  empty: "Enter amount",
  invalid: validAmountText,
  insufficient: validAmountText,
  exceeded: validAmountText,
  bufferExceeded: validAmountText,
  invalidValidator: "Please check the address on URL",
  differentValidator: "",
  closedValidator: "",
  closedDelegatedValidator: "",
  unbondingValidator: "",
  unbondingDelegatedValidator: "",
  disconnected: "Connect wallet",
  connecting: "Connecting",
  submittable: "Unstake",
};

const buttonState: Record<UnstakingStates["ctaState"], CTAButtonProps["state"]> = {
  empty: "disabled",
  invalid: "disabled",
  insufficient: "disabled",
  exceeded: "disabled",
  bufferExceeded: "disabled",
  invalidValidator: "disabled",
  differentValidator: "default",
  closedValidator: "default",
  closedDelegatedValidator: "default",
  unbondingValidator: "default",
  unbondingDelegatedValidator: "default",
  disconnected: "default",
  connecting: "loading",
  submittable: "default",
};

const buttonVariant: Record<UnstakingStates["ctaState"], CTAButtonProps["variant"]> = {
  empty: "tertiary",
  invalid: "tertiary",
  insufficient: "tertiary",
  exceeded: "tertiary",
  bufferExceeded: "tertiary",
  invalidValidator: "tertiary",
  differentValidator: "primary",
  closedValidator: "primary",
  closedDelegatedValidator: "primary",
  unbondingValidator: "primary",
  unbondingDelegatedValidator: "primary",
  disconnected: "primary",
  connecting: "primary",
  submittable: "primary",
};
