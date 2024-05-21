"use client";
import type { StakeProcedure, StakeProcedureStep, StakeProcedureState } from "../../../_services/stake/types";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as DelegationDialog from "../../../_components/DelegationDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";

export const StakingProcedureDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { network } = useShell();
  const { connectionStatus, activeWallet } = useWallet();
  const { procedures, amountInputPad, inputState, resetProceduresStates } = useStaking();
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

  useEffect(() => {
    if (!open) return;
    if (connectionStatus === "disconnected" || inputState !== "valid") {
      toggleOpen(false);
    }
  }, [connectionStatus, open, inputState]);

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
            amountInputPad.setPrimaryValue("");
            resetProceduresStates();
            queryClient.resetQueries();
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
    if (!hasAuthApproval) {
      if (authProcedure?.state === "success") {
        captureAuthSuccess();
      } else if (authProcedure?.state === "error") {
        captureAuthFailed();
      }
    }
    if (delegateProcedure?.state === "success") {
      captureDelegateSuccess();
    } else if (delegateProcedure?.state === "error") {
      captureDelegateFailed();
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
    loading: "Proceed in the wallet",
    success: "Approved",
    error: "Try again",
  },
  delegate: {
    idle: "Confirm",
    active: "Confirm",
    loading: "Proceed in the wallet",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<StakeProcedureStep, string> = {
  auth: "Approved",
  delegate: "Signed",
};
