export type StakeProcedure = {
  step: StakeProcedureStep;
  stepName: string;
  state: StakeProcedureState | null;
  txHash?: string;
  error: Error | null;
  send: () => void;
};

export type StakeProcedureStep = "auth" | "delegate";

export type StakeProcedureState = "idle" | "active" | "loading" | "success" | "error";
