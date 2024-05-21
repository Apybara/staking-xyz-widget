"use client";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import { useUnstakeMaxAmountBuffer } from "../../../_services/unstake/hooks";

export const UnstakeAmountInputPad = () => {
  const { amountInputPad, stakedBalance, setStates } = useUnstaking();
  const maxAmountBuffer = useUnstakeMaxAmountBuffer({ amount: stakedBalance.data || "0" });

  return (
    <AmountInputPad
      type="unstake"
      availableValue={stakedBalance.data}
      isAvailableValueLoading={stakedBalance.isLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      maxAmountBuffer={maxAmountBuffer}
      {...amountInputPad}
    />
  );
};
