"use client";
import type { RedelegatingStates } from "../../../_contexts/RedelegatingContext/types";
import { useDialog } from "../../../_contexts/UIContext";
import { useRedelegating } from "../../../_contexts/RedelegatingContext";
import { type CTAButtonProps, CTAButton } from "../../../_components/CTAButton";

export const RedelegateCTA = () => {
  const { ctaState } = useRedelegating();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");
  const { toggleOpen: toggleRedelegatingProcedureDialog } = useDialog("redelegatingProcedure");

  return (
    <CTAButton
      state={buttonState[ctaState]}
      variant={buttonVariant[ctaState]}
      onClick={() => {
        if (ctaState === "disconnected") {
          toggleWalletConnectionDialog(true);
        }
        if (ctaState === "submittable") {
          toggleRedelegatingProcedureDialog(true);
        }
      }}
    >
      {textMap[ctaState]}
    </CTAButton>
  );
};

const textMap: Record<RedelegatingStates["ctaState"], string> = {
  empty: "No amount provided",
  invalid: "Agree",
  insufficient: "Below minimum",
  exceeded: "Insufficient balance",
  bufferExceeded: "Insufficient amount for fees",
  invalidValidator: "Please check the address on URL",
  differentValidator: "",
  closedValidator: "",
  closedDelegatedValidator: "",
  unbondingValidator: "",
  unbondingDelegatedValidator: "",
  liquidRebalancing: "",
  withdrawFirst: "",
  disconnected: "Connect wallet",
  connecting: "Connecting",
  submittable: "Import my stake",
};

const buttonState: Record<RedelegatingStates["ctaState"], CTAButtonProps["state"]> = {
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
  liquidRebalancing: "disabled",
  withdrawFirst: "disabled",
  disconnected: "default",
  connecting: "loading",
  submittable: "default",
};

const buttonVariant: Record<RedelegatingStates["ctaState"], CTAButtonProps["variant"]> = {
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
  liquidRebalancing: "tertiary",
  withdrawFirst: "tertiary",
  disconnected: "primary",
  connecting: "primary",
  submittable: "primary",
};
