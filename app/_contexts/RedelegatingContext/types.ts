import type { Dispatch, Reducer, ReactNode } from "react";
import type { SigningStargateClient } from "@cosmjs/stargate";
import type { RedelegateProcedure } from "../../_services/redelegate/types";
import type { BasicTxCtaValidationResult } from "../../_utils/transaction";

export type RedelegatingContext = RedelegatingStates & {};

export type RedelegatingStates = {
  redelegateAmount: string;
  isAgreementChecked: boolean;
  ctaState: BasicTxCtaValidationResult;
  procedures?: Array<RedelegateProcedure>;
  cosmosSigningClient: SigningStargateClient | null;
  resetProceduresStates: () => void;
  setStates: Dispatch<Partial<RedelegatingStates>>;
};

export type RedelegatingProviderProps = {
  children: ReactNode;
};

export type UseRedelegatingReducer = Reducer<RedelegatingStates, Partial<RedelegatingStates>>;
