"use client";
import { useStaking } from "@/app/_contexts/StakingContext";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";

export const StakingProcedureDialog = () => {
  const stakingData = useStaking();

  return <TxProcedureDialog data={stakingData} type="stake" dialog="stakingProcedure" />;
};
