"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useStaking } from "../../../_contexts/StakingContext";

export const StakeAmountInputPad = () => {
  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { setStates } = useStaking();
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance({ address, network, activeWallet }) || {};

  return (
    <AmountInputPad
      type="stake"
      availableValue={balanceData}
      onDenomValueChange={(val) => {
        setStates({ denomAmountInput: val });
      }}
    />
  );
};
