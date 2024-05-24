import type { ReactNode } from "react";

export type StakeProcedure = BaseStakeProcedure & {
  state: StakeProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: StakeProcedureState | null) => void;
};

export type BaseStakeProcedure = {
  step: StakeProcedureStep;
  stepName: string;
  send: () => void;
  tooltip?: ReactNode;
};

export type StakeProcedureStep = "auth" | "delegate";

export type StakeProcedureState = "idle" | "active" | "preparing" | "loading" | "success" | "error";
