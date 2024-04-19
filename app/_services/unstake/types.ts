export type UnstakeProcedure = BaseUnstakeProcedure & {
  state: UnstakeProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: UnstakeProcedureState | null) => void;
};

export type BaseUnstakeProcedure = {
  step: UnstakeProcedureStep;
  stepName: string;
  send: () => void;
};

export type UnstakeProcedureStep = "undelegate";

export type UnstakeProcedureState = "idle" | "active" | "loading" | "success" | "error";

export type UnbondingDelegation = {
  validatorAddress: string;
  remainingTime?: {
    d: number | undefined;
    h: number | undefined;
    m: number | undefined;
    s: number | undefined;
  };
  amount: string;
};
