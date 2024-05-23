"use client";
import type {
  RedelegateProcedure,
  RedelegateProcedureStep,
  RedelegateProcedureState,
} from "../../../_services/redelegate/types";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useRedelegating } from "../../../_contexts/RedelegatingContext";
import * as DelegationDialog from "../../../_components/DelegationDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";

export const RedelegatingProcedureDialog = () => {
  const router = useRouter();
  const { network } = useShell();
  const { connectionStatus, activeWallet } = useWallet();
  const { procedures, redelegateAmount, resetProceduresStates } = useRedelegating();
  const { open, toggleOpen } = useDialog("redelegatingProcedure");
  const activityLink = useLinkWithSearchParams("activity");

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0]) return ctaTextMap.auth.idle;
    return ctaTextMap[uncheckedProcedures[0].step][uncheckedProcedures[0].state || "idle"];
  }, [uncheckedProcedures?.[0]?.step, uncheckedProcedures?.[0]?.state]);

  useEffect(() => {
    if (connectionStatus === "disconnected" && open) {
      toggleOpen(false);
    }
  }, [connectionStatus, open]);

  usePostHogEvents({ open, amount: redelegateAmount, uncheckedProcedures, procedures });

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
      <DelegationDialog.TopBox type="stake" />
      <DelegationDialog.StepsBox>
        {procedures?.map((procedure, index) => (
          <DelegationDialog.StepItem
            key={index}
            state={procedure.state || "idle"}
            onCancel={
              activeWallet === "okx"
                ? () => {
                    activeProcedure?.setState("active");
                  }
                : undefined
            }
            tooltip={procedure.tooltip}
            explorerLink={
              procedure?.txHash
                ? {
                    label: explorerLabelMap[procedure.step],
                    url: procedure?.txHash && `${networkExplorer[network || defaultNetwork]}tx/${procedure?.txHash}`,
                  }
                : undefined
            }
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
  procedures?: Array<RedelegateProcedure>;
  uncheckedProcedures: Array<RedelegateProcedure>;
}) => {
  const hasAuthApproval = uncheckedProcedures?.[0]?.step === "redelegate";
  const captureFlowStart = usePostHogEvent("redelegate_tx_flow_started");
  const captureAuthSuccess = usePostHogEvent("redelegate_tx_flow_auth_succeeded");
  const captureAuthFailed = usePostHogEvent("redelegate_tx_flow_auth_failed");
  const captureRedelegateSuccess = usePostHogEvent("redelegate_tx_flow_redelegate_succeeded");
  const captureRedelegateFailed = usePostHogEvent("redelegate_tx_flow_redelegate_failed");

  const authProcedure = procedures?.find((procedure) => procedure.step === "auth");
  const redelegateProcedure = procedures?.find((procedure) => procedure.step === "redelegate");

  useEffect(() => {
    if (open) {
      captureFlowStart({ amount, hasAuthApproval });
    }
  }, [open]);

  useEffect(() => {
    if (!hasAuthApproval && authProcedure?.state === "success") {
      captureAuthSuccess();
      return;
    }
    if (!hasAuthApproval && authProcedure?.state === "error") {
      captureAuthFailed();
      return;
    }
    if (redelegateProcedure?.state === "success") {
      captureRedelegateSuccess();
      return;
    }
    if (redelegateProcedure?.state === "error") {
      captureRedelegateFailed();
      return;
    }
  }, [hasAuthApproval, authProcedure?.step, redelegateProcedure?.state]);
};

const getUncheckedProcedures = (procedures: Array<RedelegateProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<RedelegateProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<RedelegateProcedure>) => {
  return procedures.some((procedure) => procedure.state === "loading");
};
const getActiveProcedure = (procedures: Array<RedelegateProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};

const ctaTextMap: Record<RedelegateProcedureStep, Record<RedelegateProcedureState, string>> = {
  auth: {
    idle: "Approve",
    active: "Approve",
    loading: "Approving",
    success: "Approved",
    error: "Try again",
  },
  redelegate: {
    idle: "Confirm",
    active: "Confirm",
    loading: "Confirming",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<RedelegateProcedureStep, string> = {
  auth: "Approved",
  redelegate: "Signed",
};
