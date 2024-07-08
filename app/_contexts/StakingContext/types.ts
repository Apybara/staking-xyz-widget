import type { Dispatch, Reducer, ReactNode } from "react";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { TxProcedure } from "@/app/_services/txProcedure/types";
import type { BasicAmountValidationResult, BasicTxCtaValidationResult } from "../../_utils/transaction";
import type { BaseAmountInputPadProps } from "../../_components/AmountInputPad";

export type StakingContext = StakingStates & {};

export type StakingStates = {
  coinAmountInput?: string;
  inputState?: BasicAmountValidationResult;
  ctaState: BasicTxCtaValidationResult;
  inputErrorMessage?: string;
  amountInputPad: BaseAmountInputPadProps;
  procedures?: Array<TxProcedure>;
  cosmosSigningClient: SigningStargateClient | null;
  resetProceduresStates: () => void;
  setStates: Dispatch<Partial<StakingStates>>;
  isLoadingValidatorDetails?: boolean;
  validatorDetails?: {
    isOpen?: boolean;
    name?: string;
    logo?: string;
    validatorAddress?: string;
  } | null;
};

export type StakingProviderProps = {
  children: ReactNode;
};

export type UseStakingReducer = Reducer<StakingStates, Partial<StakingStates>>;
