import type { UnstakingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { getGasFeeEstimationAmount } from "@/app/_services/unstake";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";

export const useUnstakeAmountInputValidation = ({
  inputAmount,
  stakedBalance,
}: {
  inputAmount: UnstakingStates["coinAmountInput"];
  stakedBalance?: string;
}) => {
  const { network } = useShell();
  const { connectionStatus } = useWallet();

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: stakedBalance,
    buffer: getGasFeeEstimationAmount({ amount: inputAmount, network: network || defaultNetwork }),
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};
