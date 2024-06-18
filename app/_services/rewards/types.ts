import type { ReactNode } from "react";
import { TxProcedure } from "../txProcedure/types";
import { BasicAmountValidationResult, BasicTxCtaValidationResult } from "@/app/_utils/transaction";
import { BaseAmountInputPadProps } from "@/app/_components/AmountInputPad";

export type ClaimProcedure = BaseClaimProcedure & {
  state: ClaimProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: ClaimProcedureState | null) => void;
};

export type BaseClaimProcedure = {
  step: ClaimProcedureStep;
  stepName: string;
  send: () => void;
  tooltip?: ReactNode;
};

export type ClaimProcedureStep = "claim";

export type ClaimProcedureState = "idle" | "active" | "preparing" | "loading" | "broadcasting" | "success" | "error";

export type ClaimingStates = {
  procedures?: Array<TxProcedure>;
  resetProceduresStates: () => void;
  inputState?: BasicAmountValidationResult;
  ctaState?: BasicTxCtaValidationResult;
  isAgreementChecked?: boolean;
  amountInputPad?: BaseAmountInputPadProps;
};
