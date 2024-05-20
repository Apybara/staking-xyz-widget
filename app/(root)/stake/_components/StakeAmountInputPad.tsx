"use client";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { getFeeCollectingAmount, getGasFeeEstimationAmount } from "../../../_services/stake";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useStaking } from "../../../_contexts/StakingContext";
import { defaultNetwork } from "../../../consts";

export const StakeAmountInputPad = () => {
  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountInputPad, setStates } = useStaking();
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({ address, network, activeWallet }) || {};

  const feesCollecting = getFeeCollectingAmount({ amount: balanceData || "0", network: network || defaultNetwork });
  const balanceAfterFees = BigNumber(balanceData || "0")
    .minus(BigNumber(feesCollecting))
    .toString();
  const gasFeeEstimate = getGasFeeEstimationAmount({ amount: balanceAfterFees, network: network || defaultNetwork });

  return (
    <AmountInputPad
      type="stake"
      availableValue={balanceData}
      isAvailableValueLoading={isBalanceLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
      }}
      maxAmountBuffer={BigNumber(gasFeeEstimate).plus(BigNumber(feesCollecting)).toString()}
      {...amountInputPad}
    />
  );
};
