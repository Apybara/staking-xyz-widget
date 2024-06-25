"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useStaking } from "../../../_contexts/StakingContext";
import { useStakeMaxAmountBuffer } from "@/app/_contexts/StakingContext/hooks";

export const StakeAmountInputPad = () => {
  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountInputPad, setStates } = useStaking();
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({ address, network, activeWallet }) || {};

  const maxAmountBuffer = useStakeMaxAmountBuffer({ amount: balanceData || "0" });

  return (
    <AmountInputPad
      type="stake"
      availableValue={"200"}
      isAvailableValueLoading={isBalanceLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      maxAmountBuffer={maxAmountBuffer}
      {...amountInputPad}
    />
  );
};
