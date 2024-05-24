import type { UnstakingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { getRequiredBalance } from "@/app/_services/unstake";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import { useWalletBalance } from "@/app/_services/wallet/hooks";

export const useUnstakeAmountInputValidation = ({
  inputAmount,
  stakedBalance,
}: {
  inputAmount: UnstakingStates["coinAmountInput"];
  stakedBalance?: string;
}) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: stakedBalance,
    walletBalance: balanceData,
    buffer: getRequiredBalance({ network: network || defaultNetwork }),
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};
