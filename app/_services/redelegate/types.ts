import type { ReactNode } from "react";

export type RedelegateProcedure = BaseRedelegateProcedure & {
  state: RedelegateProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: RedelegateProcedureState | null) => void;
};

export type BaseRedelegateProcedure = {
  step: RedelegateProcedureStep;
  stepName: string;
  send: () => void;
  tooltip?: ReactNode;
};

export type RedelegateProcedureStep = "auth" | "redelegate";

export type RedelegateProcedureState = "idle" | "active" | "loading" | "success" | "error";
