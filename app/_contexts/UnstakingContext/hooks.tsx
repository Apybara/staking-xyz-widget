import type { UnstakingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "@/app/_services/wallet/hooks";
import {
  BasicAmountValidationResult,
  getBasicAmountValidation,
  getBasicTxCtaValidation,
} from "../../_utils/transaction";
import { defaultNetwork, requiredBalanceUnstakingByNetwork } from "../../consts";

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
    bufferValidationAmount: requiredBalanceUnstakingByNetwork[network || defaultNetwork].toString(),
    bufferValidationMax: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};

export const useUnstakeInputErrorMessage = ({
  amountValidation,
}: {
  amountValidation: BasicAmountValidationResult;
}) => {
  const { network } = useShell();
  const defaultMessage = getDefaultInputErrorMessage({ amountValidation });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
    case "cosmoshub":
    case "cosmoshubtestnet":
    case "aleo":
      return defaultMessage;
  }
};

const getDefaultInputErrorMessage = ({ amountValidation }: { amountValidation: BasicAmountValidationResult }) => {
  switch (amountValidation) {
    case "valid":
    case "empty":
    case "invalid":
    case "insufficient":
      return undefined;
    case "exceeded":
      return "You are unstaking more than your staked balance.";
    case "bufferExceeded":
      return "Insufficient balance for fee";
  }
};
