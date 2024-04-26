"use client";
import type { StakeProcedure, StakeProcedureStep, StakeProcedureState } from "../../../_services/stake/types";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as DelegationDialog from "../../../_components/DelegationDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer } from "../../../consts";

export const StakingProcedureDialog = () => {
  const router = useRouter();
  const { network } = useShell();
  const { activeWallet } = useWallet();
  const { procedures, amountInputPad, resetProceduresStates } = useStaking();
  const { open, toggleOpen } = useDialog("stakingProcedure");
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
      <DelegationDialog.TopBox type="stake" />
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
            explorerLink={
              procedure?.txHash
                ? {
                    label: explorerLabelMap[procedure.step],
                    url: procedure?.txHash && `${networkExplorer[network || "celestia"]}tx/${procedure?.txHash}`,
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
  procedures?: Array<StakeProcedure>;
  uncheckedProcedures: Array<StakeProcedure>;
}) => {
  const hasAuthApproval = uncheckedProcedures?.[0]?.step === "delegate";
  const captureFlowStart = usePostHogEvent("stake_tx_flow_started");
  const captureAuthSuccess = usePostHogEvent("stake_tx_flow_auth_succeeded");
  const captureAuthFailed = usePostHogEvent("stake_tx_flow_auth_failed");
  const captureDelegateSuccess = usePostHogEvent("stake_tx_flow_delegate_succeeded");
  const captureDelegateFailed = usePostHogEvent("stake_tx_flow_delegate_failed");

  const authProcedure = procedures?.find((procedure) => procedure.step === "auth");
  const delegateProcedure = procedures?.find((procedure) => procedure.step === "delegate");

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
    if (delegateProcedure?.state === "success") {
      captureDelegateSuccess();
      return;
    }
    if (delegateProcedure?.state === "error") {
      captureDelegateFailed();
      return;
    }
  }, [hasAuthApproval, authProcedure?.step, delegateProcedure?.state]);
};

const getUncheckedProcedures = (procedures: Array<StakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<StakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<StakeProcedure>) => {
  return procedures.some((procedure) => procedure.state === "loading");
};
const getActiveProcedure = (procedures: Array<StakeProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};

const ctaTextMap: Record<StakeProcedureStep, Record<StakeProcedureState, string>> = {
  auth: {
    idle: "Approve",
    active: "Approve",
    loading: "Approving",
    success: "Approved",
    error: "Try again",
  },
  delegate: {
    idle: "Confirm",
    active: "Confirm",
    loading: "Confirming",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<StakeProcedureStep, string> = {
  auth: "Approved",
  delegate: "Signed",
};
