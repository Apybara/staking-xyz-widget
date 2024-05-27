import type { ReactNode } from "react";

export type ClaimProcedure = BaseClaimProcedure & {
  state: ClaimProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: ClaimProcedureState | null) => void;
};

export type BaseClaimProcedure = {
  step: ClaimProcedureStep;
  stepName: string;
  send: () => void;
  tooltip?: ReactNode;
};

export type ClaimProcedureStep = "claim";

export type ClaimProcedureState = "idle" | "active" | "preparing" | "loading" | "broadcasting" | "success" | "error";
