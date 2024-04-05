import type { Dispatch, Reducer, ReactNode } from "react";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { StakeProcedure } from "../../_services/stake/types";
import type { BasicAmountValidationResult, BasicTxCtaValidationResult } from "../../_utils/transaction";
import type { BaseAmountInputPadProps } from "../../_components/AmountInputPad";

export type StakingContext = StakingStates & {};

export type StakingStates = {
  coinAmountInput: string;
  stakeFees?: string;
  inputState: BasicAmountValidationResult;
  ctaState: BasicTxCtaValidationResult;
  amountInputPad: BaseAmountInputPadProps;
  procedures?: Array<StakeProcedure>;
  cosmosSigningClient: SigningStargateClient | null;
  resetProceduresStates: () => void;
  setStates: Dispatch<Partial<StakingStates>>;
};

export type StakingProviderProps = {
  children: ReactNode;
};

export type UseStakingReducer = Reducer<StakingStates, Partial<StakingStates>>;
