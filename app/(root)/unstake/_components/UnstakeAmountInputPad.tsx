"use client";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useUnstaking } from "../../../_contexts/UnstakingContext";

export const UnstakeAmountInputPad = () => {
  const { amountInputPad, stakedBalance, setStates, inputErrorMessage } = useUnstaking();

  return (
    <AmountInputPad
      type="unstake"
      availableValue={stakedBalance?.data}
      isAvailableValueLoading={stakedBalance?.isLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      error={inputErrorMessage}
      {...amountInputPad}
    />
  );
};
