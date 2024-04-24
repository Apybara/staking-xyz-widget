"use client";
import type { UnstakeProcedure, UnstakeProcedureStep, UnstakeProcedureState } from "../../../_services/unstake/types";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as DelegationDialog from "../../../_components/DelegationDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";

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

  usePostHogEvents({ open, amount: amountInputPad.primaryValue, uncheckedProcedures, procedures });

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
            tooltip={procedure.tooltip}
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

const usePostHogEvents = ({
  open,
  amount,
  procedures,
  uncheckedProcedures,
}: {
  open: boolean;
  amount: string;
  procedures?: Array<UnstakeProcedure>;
  uncheckedProcedures: Array<UnstakeProcedure>;
}) => {
  const hasAuthApproval = uncheckedProcedures?.[0]?.step === "undelegate";
  const captureFlowStart = usePostHogEvent("unstake_tx_flow_started");
  const captureUndelegateSuccess = usePostHogEvent("unstake_tx_flow_undelegate_succeeded");
  const captureUndelegateFailed = usePostHogEvent("unstake_tx_flow_undelegate_failed");

  const undelegateProcedure = procedures?.find((procedure) => procedure.step === "undelegate");

  useEffect(() => {
    if (open) {
      captureFlowStart({ amount });
    }
  }, [open]);

  useEffect(() => {
    if (undelegateProcedure?.state === "success") {
      captureUndelegateSuccess();
      return;
    }
    if (undelegateProcedure?.state === "error") {
      captureUndelegateFailed();
      return;
    }
  }, [hasAuthApproval, undelegateProcedure?.state]);
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
  auth: {
    idle: "Approve",
    active: "Approve",
    loading: "Approving",
    success: "Approved",
    error: "Try again",
  },
  undelegate: {
    idle: "Confirm",
    active: "Confirm",
    loading: "Confirming",
    success: "Confirmed",
    error: "Try again",
  },
};
