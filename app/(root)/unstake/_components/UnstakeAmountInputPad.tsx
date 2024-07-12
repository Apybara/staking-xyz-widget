"use client";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import { useShell } from "@/app/_contexts/ShellContext";

export const UnstakeAmountInputPad = () => {
  const { network } = useShell();
  const { amountInputPad, stakedBalance, setStates, inputErrorMessage } = useUnstaking();
  const isAleoNetwork = network && getIsAleoNetwork(network);

  return (
    <AmountInputPad
      type="unstake"
      availableValue={stakedBalance?.data}
      isAvailableValueLoading={stakedBalance?.isLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      error={inputErrorMessage}
      hideCurrencyConversion={!!isAleoNetwork}
      {...amountInputPad}
    />
  );
};
