"use client";
import { useRedelegating } from "../../../_contexts/RedelegatingContext";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";

export const RedelegatingProcedureDialog = ({ amount }: { amount: string }) => {
  const redelegatingData = useRedelegating();

  return <TxProcedureDialog amount={amount} data={redelegatingData} type="redelegate" dialog="redelegatingProcedure" />;
};
