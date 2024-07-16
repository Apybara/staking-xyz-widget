"use client";
import { useShell } from "@/app/_contexts/ShellContext";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";
import { useUnstaking } from "@/app/_contexts/UnstakingContext";
import { useWallet } from "@/app/_contexts/WalletContext";
import { useClaimingProcedures } from "@/app/_services/rewards/hooks";
import { defaultNetwork } from "@/app/consts";
import { useWithdrawableAmount } from "@/app/_services/stakingOperator/hooks";

export const UnstakingProcedureDialog = () => {
  const unstakingData = useUnstaking();
  const { network: shellNetwork } = useShell();
  const { activeWallet, address } = useWallet();
  const { withdrawableAmount } = useWithdrawableAmount() || {};

  const claimingData = useClaimingProcedures({
    amount: withdrawableAmount,
    address: address,
    network: shellNetwork || defaultNetwork,
    wallet: activeWallet,
  });

  return (
    <>
      <TxProcedureDialog data={unstakingData} type="unstake" dialog="unstakingProcedure" />
      <TxProcedureDialog title="Steps to withdraw" data={claimingData} type="claim" dialog="claimingProcedure" />
    </>
  );
};
