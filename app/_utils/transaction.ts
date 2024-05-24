import type { WalletConnectionStatus, Network } from "../types";
import BigNumber from "bignumber.js";
import { feeRatioByNetwork } from "../consts";

export const getBasicAmountValidation = ({
  amount,
  min,
  max,
  walletBalance,
  buffer,
}: {
  amount?: string;
  min?: string;
  max?: string;
  walletBalance?: string;
  buffer?: string;
}): BasicAmountValidationResult => {
  if (!amount || amount === "" || amount === "0") return "empty";

  const parsedAmount = BigNumber(amount);

  if (parsedAmount.isNaN() || parsedAmount.isNegative() || parsedAmount.isZero()) {
    return "invalid";
  }
  if (min && parsedAmount.isLessThanOrEqualTo(min)) {
    return "insufficient";
  }
  if (max && parsedAmount.isGreaterThan(max)) {
    return "exceeded";
  }
  if (!walletBalance && buffer && max && parsedAmount.plus(buffer).isGreaterThan(max)) {
    return "bufferExceeded";
  }
  if (walletBalance && buffer && parsedAmount.plus(buffer).isGreaterThan(walletBalance)) {
    return "bufferExceeded";
  }

  return "valid";
};

export const getBasicTxCtaValidation = ({
  amountValidation,
  walletConnectionStatus,
}: {
  amountValidation: BasicAmountValidationResult;
  walletConnectionStatus: WalletConnectionStatus;
}): BasicTxCtaValidationResult => {
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
  if (amountValidation !== "valid") return amountValidation;
  if (!isAgreementChecked) return "invalid";
  if (walletConnectionStatus === "disconnected") return "disconnected";
  if (walletConnectionStatus === "connecting") return "connecting";
  return "submittable";
};

export const getStakeFees = ({ amount, network }: { amount: string; network: Network }) => {
  const ratio = feeRatioByNetwork[network];
  return BigNumber(amount).times(ratio).toString();
};

export type BasicAmountValidationResult =
  | "valid"
  | "empty"
  | "invalid"
  | "insufficient"
  | "exceeded"
  | "bufferExceeded";

export type BasicTxCtaValidationResult =
  | "empty"
  | "invalid"
  | "insufficient"
  | "exceeded"
  | "bufferExceeded"
  | "disconnected"
  | "connecting"
  | "submittable";
