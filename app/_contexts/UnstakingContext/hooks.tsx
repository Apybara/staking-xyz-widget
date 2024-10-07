import type { UnstakingStates } from "./types";
import { useMemo } from "react";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "@/app/_services/wallet/hooks";
import {
  BasicAmountValidationResult,
  getBasicAmountValidation,
  getBasicTxCtaValidation,
} from "../../_utils/transaction";
import {
  defaultNetwork,
  requiredBalanceUnstakingByNetwork,
  minStakedBalanceByNetwork,
  networkDefaultStakingType,
} from "../../consts";
import { useAleoAddressUnbondingStatus } from "@/app/_services/aleo/hooks";
import { getAleoTotalUnstakeFees } from "@/app/_services/aleo/utils";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";

export const useUnstakeAmountInputValidation = ({
  inputAmount,
  stakedBalance,
  isAleoInstantWithdrawal,
}: {
  inputAmount: UnstakingStates["coinAmountInput"];
  stakedBalance?: string;
  isAleoInstantWithdrawal?: boolean;
}) => {
  const { network, stakingType } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const minStakedBalance = stakingType ? minStakedBalanceByNetwork[network || defaultNetwork][stakingType] : 0;
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });
  const { pAleoToAleoRate } = usePondoData() || {};

  const bufferValidationAmount = useMemo(() => {
    if (network !== "aleo") return requiredBalanceUnstakingByNetwork[network || defaultNetwork].toString();

    return getAleoTotalUnstakeFees({
      amount: inputAmount || "",
      stakingType: stakingType || networkDefaultStakingType.aleo!,
      isInstant: isAleoInstantWithdrawal || false,
      pAleoToAleoRate,
    })?.toString();
  }, [network, inputAmount, stakingType, isAleoInstantWithdrawal, pAleoToAleoRate]);

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: "0",
    max: stakedBalance,
    safeMin: minStakedBalance ? minStakedBalance.toString() : undefined,
    bufferValidationAmount,
    bufferValidationMax: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
    withdrawing: stakingType === "liquid" && !!aleoUnstakeStatus,
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
  const { address } = useWallet();
  const { network, stakingType } = useShell();
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });
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
          if (!!aleoUnstakeStatus && !aleoUnstakeStatus?.isWithdrawable) {
            return "Only one unstaking request is possible at a time. Please wait until the current request is completed before submitting another one.";
          }
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
      return "Insufficient balance for fee.";
  }
};
