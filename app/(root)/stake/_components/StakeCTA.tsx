"use client";
import { useRouter } from "next/navigation";
import type { StakingStates } from "../../../_contexts/StakingContext/types";
import { useDialog } from "../../../_contexts/UIContext";
import { useStaking } from "../../../_contexts/StakingContext";
import { type CTAButtonProps, CTAButton } from "../../../_components/CTAButton";
import { useLinkWithSearchParams } from "@/app/_utils/routes";

export const StakeCTA = () => {
  const router = useRouter();
  const unstakePageLink = useLinkWithSearchParams("unstake");
  const { ctaState } = useStaking();
  const { toggleOpen: toggleWalletConnectionDialog } = useDialog("walletConnection");
  const { toggleOpen: toggleStakingProcedureDialog } = useDialog("stakingProcedure");

  return (
    <CTAButton
      state={buttonState[ctaState]}
      variant={buttonVariant[ctaState]}
      onClick={() => {
        if (ctaState === "differentValidator") {
          router.push(unstakePageLink);
        }
        if (ctaState === "disconnected") {
          toggleWalletConnectionDialog(true);
        }
        if (ctaState === "submittable") {
          toggleStakingProcedureDialog(true);
        }
      }}
    >
      {textMap[ctaState]}
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
  invalidValidator: "Please check the address on URL",
  differentValidator: "Go to Unstake",
  closedValidator: "Please try another address",
  closedDelegatedValidator: "Go to Unstake",
  unbondingValidator: "Please try again later in an hour",
  unbondingDelegatedValidator: "Please try again later in an hour",
  liquidRebalancing: "Please try again later in 10 minutes",
  claimFirst: "Please try again later in 10 minutes",
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
  invalidValidator: "disabled",
  differentValidator: "default",
  closedValidator: "disabled",
  closedDelegatedValidator: "default",
  unbondingValidator: "disabled",
  unbondingDelegatedValidator: "disabled",
  liquidRebalancing: "disabled",
  claimFirst: "disabled",
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
  invalidValidator: "tertiary",
  differentValidator: "primary",
  closedValidator: "tertiary",
  closedDelegatedValidator: "primary",
  unbondingValidator: "tertiary",
  unbondingDelegatedValidator: "tertiary",
  liquidRebalancing: "tertiary",
  claimFirst: "tertiary",
  disconnected: "primary",
  connecting: "primary",
  submittable: "primary",
};
