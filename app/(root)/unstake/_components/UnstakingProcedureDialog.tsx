"use client";
import type { UnstakeProcedure, UnstakeProcedureStep, UnstakeProcedureState } from "../../../_services/unstake/types";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as TransactionDialog from "../../../_components/TransactionDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";

export const UnstakingProcedureDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { network } = useShell();
  const { connectionStatus, activeWallet } = useWallet();
  const { procedures, amountInputPad, inputState, resetProceduresStates } = useUnstaking();
  const { open, toggleOpen } = useDialog("unstakingProcedure");
  const activityLink = useLinkWithSearchParams("activity");

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const isLoading = getIsLoadingState(uncheckedProcedures?.[0]);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0]) return ctaTextMap.undelegate.idle;
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
    <TransactionDialog.Shell
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
      <TransactionDialog.TopBox type="unstake" />
      <TransactionDialog.StepsBox>
        {procedures?.map((procedure, index) => (
          <TransactionDialog.StepItem
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
          </TransactionDialog.StepItem>
        ))}
      </TransactionDialog.StepsBox>
      {!allProceduresCompleted ? (
        <TransactionDialog.CTAButton
          state={isLoading ? "loading" : "default"}
          disabled={isLoading}
          onClick={() => activeProcedure?.send()}
        >
          {ctaText}
        </TransactionDialog.CTAButton>
      ) : (
        <TransactionDialog.ResultButtons
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
    </TransactionDialog.Shell>
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
  const captureAuthSuccess = usePostHogEvent("stake_tx_flow_auth_succeeded");
  const captureAuthFailed = usePostHogEvent("stake_tx_flow_auth_failed");
  const captureUndelegateSuccess = usePostHogEvent("unstake_tx_flow_undelegate_succeeded");
  const captureUndelegateFailed = usePostHogEvent("unstake_tx_flow_undelegate_failed");

  const authProcedure = procedures?.find((procedure) => procedure.step === "auth");
  const undelegateProcedure = procedures?.find((procedure) => procedure.step === "undelegate");

  useEffect(() => {
    if (open) {
      captureFlowStart({ amount });
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
    if (undelegateProcedure?.state === "success") {
      captureUndelegateSuccess();
    } else if (undelegateProcedure?.state === "error") {
      captureUndelegateFailed();
    }
  }, [hasAuthApproval, authProcedure?.step, undelegateProcedure?.state]);
};

const getUncheckedProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<UnstakeProcedure>) => {
  return procedures.some(
    (procedure) =>
      procedure.state === "preparing" || procedure.state === "loading" || procedure.state === "broadcasting",
  );
};
const getActiveProcedure = (procedures: Array<UnstakeProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};
const getIsLoadingState = (procedure: UnstakeProcedure) => {
  return procedure?.state === "preparing" || procedure?.state === "loading" || procedure?.state === "broadcasting";
};

const ctaTextMap: Record<UnstakeProcedureStep, Record<UnstakeProcedureState, string>> = {
  auth: {
    idle: "Approve",
    active: "Approve",
    preparing: "Preparing transaction",
    loading: "Proceed in the wallet",
    broadcasting: "Broadcasting transaction",
    success: "Approved",
    error: "Try again",
  },
  undelegate: {
    idle: "Confirm",
    active: "Confirm",
    preparing: "Preparing transaction",
    loading: "Proceed in the wallet",
    broadcasting: "Broadcasting transaction",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<UnstakeProcedureStep, string> = {
  auth: "Approved",
  undelegate: "Signed",
};
