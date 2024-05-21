import type { UnstakingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import {
  getBasicAmountValidation,
  getBasicTxCtaValidation,
  getDenomValueFromCoinByNetwork,
  getEstGasAmount,
} from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import { useUnstakeMaxAmountBuffer } from "../../_services/unstake/hooks";

export const useUnstakeAmountInputValidation = ({
  inputAmount,
  stakedBalance,
}: {
  inputAmount: UnstakingStates["coinAmountInput"];
  stakedBalance?: string;
}) => {
  const { network } = useShell();
  const { connectionStatus } = useWallet();
  const castedNetwork = network || defaultNetwork;

  const denomAmount = getDenomValueFromCoinByNetwork({ network: castedNetwork, amount: inputAmount });
  const denomStakedBalance = getDenomValueFromCoinByNetwork({ network: castedNetwork, amount: stakedBalance || "0" });
  const maxAmountBuffer = useUnstakeMaxAmountBuffer({ amount: denomAmount });

  const amountValidation = getBasicAmountValidation({
    amount: denomAmount,
    min: "0",
    max: denomStakedBalance,
    buffer: maxAmountBuffer,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};
