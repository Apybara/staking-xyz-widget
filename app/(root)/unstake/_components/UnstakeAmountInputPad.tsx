"use client";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import { useShell } from "@/app/_contexts/ShellContext";
import { getRequiredBalance } from "@/app/_services/unstake";
import { defaultNetwork } from "../../../consts";

export const UnstakeAmountInputPad = () => {
  const { network } = useShell();
  const { amountInputPad, stakedBalance, setStates } = useUnstaking();

  return (
    <AmountInputPad
      type="unstake"
      availableValue={stakedBalance.data}
      isAvailableValueLoading={stakedBalance.isLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      maxAmountBuffer={getRequiredBalance({ network: network || defaultNetwork })}
      {...amountInputPad}
    />
  );
};
