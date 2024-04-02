import type { StakingStates } from "./types";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation, getStakeDenomFees } from "../../../_utils/transaction";

export const useStakeAmountInputValidation = ({ inputAmount }: { inputAmount: StakingStates["denomAmountInput"] }) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};

export const useDenomStakeFees = ({ inputAmount }: { inputAmount: StakingStates["denomAmountInput"] }) => {
  const { network } = useShell();

  if (inputAmount === "" || inputAmount === "0") return undefined;
  return getStakeDenomFees({ amount: inputAmount, network: network || "celestia" });
};
