"use client";
import type { ClaimProcedure, ClaimProcedureStep, ClaimProcedureState } from "../../../_services/rewards/types";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDialog } from "../../../_contexts/UIContext";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import * as TransactionDialog from "../../../_components/TransactionDialog";
import { useLinkWithSearchParams } from "../../../_utils/routes";
import { usePostHogEvent } from "../../../_services/postHog/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";
import { useClaimingProcedures } from "../../../_services/rewards/hooks";
import { useCosmosSigningClient } from "../../../_services/cosmos/hooks";

export const ClaimingProcedureDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { network } = useShell();
  const { connectionStatus, activeWallet, address } = useWallet();
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || defaultNetwork,
    wallet: activeWallet,
  });
  const { procedures, resetStates } = useClaimingProcedures({
    address: address,
    network: network || defaultNetwork,
    cosmosSigningClient,
  });
  const { open, toggleOpen } = useDialog("claimingProcedure");
  const activityLink = useLinkWithSearchParams("activity");

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const isLoading = getIsLoadingState(uncheckedProcedures?.[0]);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0]) return ctaTextMap.claim.idle;
    return ctaTextMap[uncheckedProcedures[0].step][uncheckedProcedures[0].state || "idle"];
  }, [uncheckedProcedures?.[0]?.step, uncheckedProcedures?.[0]?.state]);

  useEffect(() => {
    if (!open) return;
    if (connectionStatus === "disconnected") {
      toggleOpen(false);
    }
  }, [connectionStatus, open]);

  usePostHogEvents({ open, procedures });

  return (
    <TransactionDialog.Shell
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (hasLoadingProcedures) {
            return;
          }

          if (open) resetStates();
          toggleOpen(!open);
        },
      }}
    >
      <TransactionDialog.TopBox type="claim" />
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
            resetStates();
            queryClient.resetQueries();
            toggleOpen(false);
          }}
        />
      )}
    </TransactionDialog.Shell>
  );
};

const usePostHogEvents = ({ open, procedures }: { open: boolean; procedures?: Array<ClaimProcedure> }) => {
  const captureFlowStart = usePostHogEvent("claim_tx_flow_started");
  const captureSuccess = usePostHogEvent("claim_tx_flow_succeeded");
  const captureFailed = usePostHogEvent("claim_tx_flow_failed");

  const claimProcedure = procedures?.find((procedure) => procedure.step === "claim");

  useEffect(() => {
    if (open) {
      captureFlowStart();
    }
  }, [open]);

  useEffect(() => {
    if (claimProcedure?.state === "success") {
      captureSuccess();
    } else if (claimProcedure?.state === "error") {
      captureFailed();
    }
  }, [claimProcedure?.state]);
};

const getUncheckedProcedures = (procedures: Array<ClaimProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<ClaimProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<ClaimProcedure>) => {
  return procedures.some(
    (procedure) =>
      procedure.state === "preparing" || procedure.state === "loading" || procedure.state === "broadcasting",
  );
};
const getActiveProcedure = (procedures: Array<ClaimProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};
const getIsLoadingState = (procedure: ClaimProcedure) => {
  return procedure?.state === "preparing" || procedure?.state === "loading" || procedure?.state === "broadcasting";
};

const ctaTextMap: Record<ClaimProcedureStep, Record<ClaimProcedureState, string>> = {
  claim: {
    idle: "Confirm",
    active: "Confirm",
    preparing: "Preparing transaction",
    loading: "Proceed in the wallet",
    broadcasting: "Broadcasting transaction",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<ClaimProcedureStep, string> = {
  claim: "Signed",
};
