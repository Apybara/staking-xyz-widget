import type { Dispatch, Reducer, ReactNode } from "react";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { TxProcedure } from "@/app/_services/txProcedure/types";
import type { BasicAmountValidationResult, BasicTxCtaValidationResult } from "../../_utils/transaction";
import type { BaseAmountInputPadProps } from "@/app/_components/AmountInputPad";

export type RedelegatingContext = RedelegatingStates & {};

export type RedelegatingStates = {
  inputState?: BasicAmountValidationResult;
  ctaState: BasicTxCtaValidationResult;
  isAgreementChecked?: boolean;
  amountInputPad?: BaseAmountInputPadProps;
  procedures?: Array<TxProcedure>;
  cosmosSigningClient: SigningStargateClient | null;
  resetProceduresStates: () => void;
  setStates: Dispatch<Partial<RedelegatingStates>>;
};

export type RedelegatingProviderProps = {
  children: ReactNode;
};

export type UseRedelegatingReducer = Reducer<RedelegatingStates, Partial<RedelegatingStates>>;
