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
import * as TransactionDialog from "../../../_components/TransactionDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";
import { useExternalDelegations } from "@/app/_services/stakingOperator/hooks";

export const RedelegatingProcedureDialog = () => {
  const router = useRouter();
  const { network } = useShell();
  const { connectionStatus, activeWallet } = useWallet();
  const { procedures, resetProceduresStates } = useRedelegating();
  const { open, toggleOpen } = useDialog("redelegatingProcedure");
  const activityLink = useLinkWithSearchParams("activity");
  const homeLink = useLinkWithSearchParams("");

  const externalDelegations = useExternalDelegations();
  const { redelegationAmount } = externalDelegations?.data || {};

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const isLoading = getIsLoadingState(uncheckedProcedures?.[0]);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0]) return ctaTextMap.auth.idle;
    return ctaTextMap[uncheckedProcedures[0].step][uncheckedProcedures[0].state || "idle"];
  }, [uncheckedProcedures?.[0]?.step, uncheckedProcedures?.[0]?.state]);

  useEffect(() => {
    if (!open) return;
    if (connectionStatus === "disconnected" && open) {
      toggleOpen(false);
    }
  }, [connectionStatus, open]);

  usePostHogEvents({ open, amount: redelegationAmount || "0", uncheckedProcedures, procedures });

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
      <TransactionDialog.TopBox type="redelegate" />
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
            router.push(homeLink);
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
    if (!hasAuthApproval) {
      if (authProcedure?.state === "success") {
        captureAuthSuccess();
      } else if (authProcedure?.state === "error") {
        captureAuthFailed();
      }
    }
    if (redelegateProcedure?.state === "success") {
      captureRedelegateSuccess();
    } else if (redelegateProcedure?.state === "error") {
      captureRedelegateFailed();
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
const getIsLoadingState = (procedure: RedelegateProcedure) => {
  return procedure?.state === "preparing" || procedure?.state === "loading" || procedure?.state === "broadcasting";
};

const ctaTextMap: Record<RedelegateProcedureStep, Record<RedelegateProcedureState, string>> = {
  auth: {
    idle: "Approve",
    active: "Approve",
    preparing: "Preparing transaction",
    loading: "Approving",
    broadcasting: "Broadcasting transaction",
    success: "Approved",
    error: "Try again",
  },
  redelegate: {
    idle: "Confirm",
    active: "Confirm",
    preparing: "Preparing transaction",
    loading: "Confirming",
    broadcasting: "Broadcasting transaction",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<RedelegateProcedureStep, string> = {
  auth: "Approved",
  redelegate: "Signed",
};
