"use client";
import type { UnstakeProcedure, UnstakeProcedureStep, UnstakeProcedureState } from "../../../_services/unstake/types";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as DelegationDialog from "../../../_components/DelegationDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";

export const UnstakingProcedureDialog = () => {
  const router = useRouter();
  const { activeWallet } = useWallet();
  const { procedures, amountInputPad, resetProceduresStates } = useUnstaking();
  const { open, toggleOpen } = useDialog("unstakingProcedure");
  const activityLink = useLinkWithSearchParams("activity");

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0]) return ctaTextMap.undelegate.idle;
    return ctaTextMap[uncheckedProcedures[0].step][uncheckedProcedures[0].state || "idle"];
  }, [uncheckedProcedures?.[0]?.step, uncheckedProcedures?.[0]?.state]);

  return (
    <DelegationDialog.Shell
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (hasLoadingProcedures) {
            return;
          }

          if (open) resetProceduresStates();
          toggleOpen(!open);
        },
      }}
    >
      <DelegationDialog.TopBox type="unstake" />
      <DelegationDialog.StepsBox>
        {procedures?.map((procedure, index) => (
          <DelegationDialog.StepItem
            key={index}
            state={procedure.state || "idle"}
            onCancel={
              activeWallet === "okx" || activeWallet?.includes("Mobile")
                ? () => {
                    activeProcedure?.setState("active");
                  }
                : undefined
            }
            // explorerUrl={procedure?.txHash && `${networkExplorer[network || "celestia"]}tx/${procedure?.txHash}`}
          >
            {procedure.stepName}
          </DelegationDialog.StepItem>
        ))}
      </DelegationDialog.StepsBox>
      {!allProceduresCompleted ? (
        <DelegationDialog.CTAButton
          state={uncheckedProcedures?.[0]?.state === "loading" ? "loading" : "default"}
          disabled={uncheckedProcedures?.[0]?.state === "loading"}
          onClick={() => activeProcedure?.send()}
        >
          {ctaText}
        </DelegationDialog.CTAButton>
      ) : (
        <DelegationDialog.ResultButtons
          onActivityButtonClick={() => {
            router.push(activityLink);
          }}
          onDismissButtonClick={() => {
            amountInputPad.setPrimaryValue("");
            resetProceduresStates();
            toggleOpen(false);
          }}
        />
      )}
    </DelegationDialog.Shell>
  );
};

const getUncheckedProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.some((procedure) => procedure.state === "loading");
};
const getActiveProcedure = (procedures: Array<UnstakeProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};

const ctaTextMap: Record<UnstakeProcedureStep, Record<UnstakeProcedureState, string>> = {
  undelegate: {
    idle: "Confirm",
    active: "Confirm",
    loading: "Confirming",
    success: "Confirmed",
    error: "Try again",
  },
};
