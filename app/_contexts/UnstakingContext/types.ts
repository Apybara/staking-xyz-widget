import type { Dispatch, Reducer, ReactNode } from "react";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { UnstakeProcedure } from "../../_services/unstake/types";
import type { BasicAmountValidationResult, BasicTxCtaValidationResult } from "../../_utils/transaction";
import type { BaseAmountInputPadProps } from "../../_components/AmountInputPad";

export type UnstakingContext = UnstakingStates & {};

export type UnstakingStates = {
  coinAmountInput: string;
  inputState: BasicAmountValidationResult;
  ctaState: BasicTxCtaValidationResult;
  amountInputPad: BaseAmountInputPadProps;
  procedures?: Array<UnstakeProcedure>;
  stakedBalance: {
    data?: string;
    isLoading: boolean;
    error: Error | null;
  };
  cosmosSigningClient: SigningStargateClient | null;
  resetProceduresStates: () => void;
  setStates: Dispatch<Partial<UnstakingStates>>;
};

export type UnstakingProviderProps = {
  children: ReactNode;
};

export type UseUnstakingReducer = Reducer<UnstakingStates, Partial<UnstakingStates>>;
