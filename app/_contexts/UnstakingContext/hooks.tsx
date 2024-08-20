import type { UnstakingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "@/app/_services/wallet/hooks";
import {
  BasicAmountValidationResult,
  getBasicAmountValidation,
  getBasicTxCtaValidation,
} from "../../_utils/transaction";
import { defaultNetwork, requiredBalanceUnstakingByNetwork, minStakedBalanceByNetwork } from "../../consts";
import { useAleoAddressUnbondingStatus } from "@/app/_services/aleo/hooks";

export const useUnstakeAmountInputValidation = ({
  inputAmount,
  stakedBalance,
}: {
  inputAmount: UnstakingStates["coinAmountInput"];
  stakedBalance?: string;
}) => {
  const { network, stakingType } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const minStakedBalance = stakingType ? minStakedBalanceByNetwork[network || defaultNetwork][stakingType] : 0;
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: stakedBalance,
    safeMin: minStakedBalance ? minStakedBalance.toString() : undefined,
    bufferValidationAmount: requiredBalanceUnstakingByNetwork[network || defaultNetwork].toString(),
    bufferValidationMax: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
    withdrawFirst: stakingType === "liquid" && aleoUnstakeStatus?.isWithdrawable,
  });

  return { amountValidation, ctaValidation };
};

export const useUnstakeInputErrorMessage = ({
  amountValidation,
  inputAmount,
}: {
  amountValidation: BasicAmountValidationResult;
  inputAmount: UnstakingStates["coinAmountInput"];
}) => {
  const { network, stakingType } = useShell();
  const defaultMessage = getDefaultInputErrorMessage({ amountValidation });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
    case "cosmoshub":
    case "cosmoshubtestnet":
      return defaultMessage;
    case "aleo":
      switch (stakingType) {
        case "liquid":
          return defaultMessage;
        case "native":
          if (amountValidation === "safeMinInsufficient") {
            return `Unstaking ${inputAmount} ALEO will reduce your staked balance below the minimum 10K ALEO requirement and will unstake of all your staked balance.`;
          }
          return defaultMessage;
      }
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
