"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useStaking } from "../../../_contexts/StakingContext";
import { useStakeMaxAmountBuffer } from "@/app/_contexts/StakingContext/hooks";
import { stakingTypeErrorMap } from "@/app/consts";
import { BasicAmountValidationResult } from "@/app/_utils/transaction";

export const StakeAmountInputPad = () => {
  const { network, stakingType } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountInputPad, setStates, inputState } = useStaking();
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({ address, network, activeWallet }) || {};

  const maxAmountBuffer = useStakeMaxAmountBuffer({ amount: balanceData || "0" });

  return (
    <AmountInputPad
      type="stake"
      availableValue={balanceData}
      isAvailableValueLoading={isBalanceLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      maxAmountBuffer={maxAmountBuffer}
      isStakingType={!!stakingType}
      error={stakingType ? stakingTypeErrorMap[inputState as BasicAmountValidationResult] : ""}
      {...amountInputPad}
    />
  );
};
