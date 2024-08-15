"use client";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import { useShell } from "@/app/_contexts/ShellContext";

export const UnstakeAmountInputPad = () => {
  const { network, stakingType } = useShell();
  const { amountInputPad, stakedBalance, pAleoBalance, setStates, inputErrorMessage } = useUnstaking();

  const isAleoNetwork = network && getIsAleoNetwork(network);
  const availableValueData = isAleoNetwork && stakingType === "liquid" ? pAleoBalance : stakedBalance;

  return (
    <AmountInputPad
      type="unstake"
      availableValue={availableValueData?.data}
      isAvailableValueLoading={availableValueData?.isLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      error={inputErrorMessage}
      hideCurrencyConversion={!!isAleoNetwork}
      {...amountInputPad}
    />
  );
};
