export type StakeProcedure = BaseStakeProcedure & {
  state: StakeProcedureState | null;
  txHash?: string;
  error: Error | null;
};

export type BaseStakeProcedure = {
  step: StakeProcedureStep;
  stepName: string;
  send: () => void;
};

export type StakeProcedureStep = "auth" | "delegate";

export type StakeProcedureState = "idle" | "active" | "loading" | "success" | "error";
