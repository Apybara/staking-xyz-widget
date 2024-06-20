"use client";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";
import { useUnstaking } from "@/app/_contexts/UnstakingContext";

export const UnstakingProcedureDialog = () => {
  const unstakingData = useUnstaking();

  return <TxProcedureDialog data={unstakingData} type="unstake" dialog="unstakingProcedure" />;
};
