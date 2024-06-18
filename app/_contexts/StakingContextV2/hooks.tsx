import type { StakingStates } from "./types";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import { useStakeMaxAmountBuffer } from "@/app/_services/stake/hooks";
import { TxProcedure } from "@/app/_services/txProcedure/types";
import { usePostHogEvent } from "@/app/_services/postHog/hooks";
import { useEffect } from "react";

export const useStakeAmountInputValidation = ({
  inputAmount = "0",
}: {
  inputAmount: StakingStates["coinAmountInput"];
}) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const buffer = useStakeMaxAmountBuffer({ amount: inputAmount });

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: balanceData,
    bufferValidationAmount: BigNumber(inputAmount).plus(buffer).toString(),
    bufferValidationMax: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};
