import type { ReactNode } from "react";

export type TxProcedure = BaseTxProcedure & {
  state: TxProcedureState | null;
  txHash?: string;
  error: Error | null;
  setState: (state: TxProcedureState | null) => void;
};

export type BaseTxProcedure = {
  step: TxProcedureStep;
  stepName: string;
  send: () => void;
  tooltip?: ReactNode;
};

export type TxProcedureType = "delegate" | "undelegate" | "instant_undelegate" | "redelegate" | "claim";

export type TxProcedureStep = "auth" | "sign";

export type TxProcedureState = "idle" | "active" | "preparing" | "loading" | "broadcasting" | "success" | "error";

export type TxStepCallbacks = {
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash?: string) => void;
  onError?: (e: Error, txHash?: string) => void;
};
