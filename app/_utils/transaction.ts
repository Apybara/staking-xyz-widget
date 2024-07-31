import type { WalletConnectionStatus, Network } from "../types";
import BigNumber from "bignumber.js";
import { feeRatioByNetwork } from "../consts";

export const getBasicAmountValidation = ({
  amount,
  min,
  max,
  safeMin,
  bufferValidationAmount,
  bufferValidationMax,
}: {
  amount?: string;
  min?: string;
  max?: string;
  safeMin?: string;
  bufferValidationAmount?: string;
  bufferValidationMax?: string;
}): BasicAmountValidationResult => {
  if (!amount || amount === "" || amount === "0") {
    return "empty";
  }

  const parsedAmount = BigNumber(amount);

  if (parsedAmount.isNaN() || parsedAmount.isNegative() || parsedAmount.isZero()) {
    return "invalid";
  }
  if (min && parsedAmount.isLessThan(min)) {
    return "insufficient";
  }
  if (max && parsedAmount.isGreaterThan(max)) {
    return "exceeded";
  }
  if (max && safeMin && BigNumber(max).minus(parsedAmount).isLessThan(safeMin)) {
    return "safeMinInsufficient";
  }
  if (
    bufferValidationAmount &&
    bufferValidationMax &&
    BigNumber(bufferValidationAmount).isGreaterThan(bufferValidationMax)
  ) {
    return "bufferExceeded";
  }

  return "valid";
};

export const getBasicTxCtaValidation = ({
  amountValidation,
  walletConnectionStatus,
  closedValidator,
  closedDelegatedValidator,
  unbondingValidator,
  unbondingDelegatedValidator,
  invalidValidator,
  differentValidator,
}: {
  amountValidation: BasicAmountValidationResult;
  walletConnectionStatus: WalletConnectionStatus;
  closedValidator?: boolean;
  closedDelegatedValidator?: boolean;
  unbondingValidator?: boolean;
  unbondingDelegatedValidator?: boolean;
  invalidValidator?: boolean;
  differentValidator?: boolean;
}): BasicTxCtaValidationResult => {
  if (closedValidator) return "closedValidator";
  if (closedDelegatedValidator) return "closedDelegatedValidator";
  if (unbondingValidator) return "unbondingValidator";
  if (unbondingDelegatedValidator) return "unbondingDelegatedValidator";
  if (invalidValidator) return "invalidValidator";
  if (differentValidator) return "differentValidator";
  if (amountValidation === "safeMinInsufficient") return "submittable";
  if (amountValidation !== "valid") return amountValidation;
  if (walletConnectionStatus === "disconnected") return "disconnected";
  if (walletConnectionStatus === "connecting") return "connecting";
  return "submittable";
};

export const getBasicRedelegateCtaValidation = ({
  isAgreementChecked,
  amountValidation,
  walletConnectionStatus,
}: {
  isAgreementChecked: boolean;
  amountValidation: BasicAmountValidationResult;
  walletConnectionStatus: WalletConnectionStatus;
}): BasicTxCtaValidationResult => {
  if (amountValidation === "safeMinInsufficient") return "submittable";
  if (amountValidation !== "valid") return amountValidation;
  if (!isAgreementChecked) return "invalid";
  if (walletConnectionStatus === "disconnected") return "disconnected";
  if (walletConnectionStatus === "connecting") return "connecting";
  return "submittable";
};

export const getStakeFees = ({
  amount,
  network,
  floorResult,
}: {
  amount: string;
  network: Network;
  floorResult?: boolean;
}) => {
  if (amount === "" || amount === "0") return undefined;

  const ratio = feeRatioByNetwork[network];
  const result = BigNumber(amount).times(ratio);
  return floorResult ? Math.floor(result.toNumber()).toString() : result.toString();
};

export type BasicAmountValidationResult =
  | "valid"
  | "empty"
  | "invalid"
  | "insufficient"
  | "exceeded"
  | "bufferExceeded"
  | "safeMinInsufficient";

export type BasicTxCtaValidationResult =
  | "empty"
  | "invalid"
  | "insufficient"
  | "exceeded"
  | "bufferExceeded"
  | "closedValidator"
  | "closedDelegatedValidator"
  | "invalidValidator"
  | "differentValidator"
  | "unbondingValidator"
  | "unbondingDelegatedValidator"
  | "liquidRebalancing"
  | "claimFirst"
  | "disconnected"
  | "connecting"
  | "submittable";
