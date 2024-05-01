import type { StakingStates } from "./types";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { getFeeCollectingAmount } from "../../_services/stake";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation, getStakeFees } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";

export const useStakeAmountInputValidation = ({ inputAmount }: { inputAmount: StakingStates["coinAmountInput"] }) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: balanceData,
    buffer: getFeeCollectingAmount({ amount: inputAmount, network: network || defaultNetwork }),
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
