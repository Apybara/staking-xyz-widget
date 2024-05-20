import BigNumber from "bignumber.js";
import type { StakingStates } from "./types";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { getFeeCollectingAmount, getRequiredBalance } from "../../_services/stake";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation, getStakeFees } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";

export const useStakeAmountInputValidation = ({ inputAmount }: { inputAmount: StakingStates["coinAmountInput"] }) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const requiredBalance = getRequiredBalance({ network: network || defaultNetwork });
  const feesCollecting = getFeeCollectingAmount({ amount: inputAmount, network: network || defaultNetwork });

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: balanceData,
    buffer: BigNumber(requiredBalance).plus(BigNumber(feesCollecting)).toString(),
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};

export const useStakeFees = ({ inputAmount }: { inputAmount: StakingStates["coinAmountInput"] }) => {
  const { network } = useShell();

  if (inputAmount === "" || inputAmount === "0") return undefined;
  return getStakeFees({ amount: inputAmount, network: network || defaultNetwork });
};
