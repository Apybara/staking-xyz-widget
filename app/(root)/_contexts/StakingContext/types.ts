import type { Dispatch, Reducer, ReactNode } from "react";
import type { BasicAmountValidationResult, BasicTxCtaValidationResult } from "../../../_utils/transaction";

export type StakingContext = StakingStates & {};

export type StakingStates = {
  denomAmountInput: string;
  denomStakeFees?: string;
  inputState: BasicAmountValidationResult;
  ctaState: BasicTxCtaValidationResult;
  setStates: Dispatch<Partial<StakingStates>>;
};

export type StakingProviderProps = {
  children: ReactNode;
};

export type UseStakingReducer = Reducer<StakingStates, Partial<StakingStates>>;
