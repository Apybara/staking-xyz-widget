"use client";
import type { TxProcedure, TxProcedureStep, TxProcedureState } from "@/app/_services/txProcedure/types";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import * as TransactionDialog from "../../_components/TransactionDialog";
import { useLinkWithSearchParams } from "../../_utils/routes";
import { networkExplorerTx, defaultNetwork } from "../../consts";
import { UnstakingStates } from "@/app/_contexts/UnstakingContext/types";
import { StakingStates } from "@/app/_contexts/StakingContext/types";
import { RedelegatingStates } from "@/app/_contexts/RedelegatingContext/types";
import { DialogTypeVariant } from "@/app/_contexts/UIContext/types";
import { ClaimingStates } from "@/app/_services/rewards/types";
import type { TxType } from "@/app/types";
import { useTxPostHogEvents } from "@/app/_services/postHog/hooks";

import * as S from "../../_components/TransactionDialog/delegationDialog.css";
import { WalletStates } from "@/app/_contexts/WalletContext/types";

export const TxProcedureDialog = ({
  title,
  amount,
  data,
  type,
  dialog,
}: {
  title?: string;
  amount?: string;
  data: StakingStates | UnstakingStates | RedelegatingStates | ClaimingStates;
  type: TxType;
  dialog: DialogTypeVariant;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { network } = useShell();
  const { connectionStatus, activeWallet } = useWallet();
  const { procedures, amountInputPad, inputState, resetProceduresStates } = data;
  const { open, toggleOpen } = useDialog(dialog);
  const { toggleOpen: togglePendingTransactionsDialog } = useDialog("pendingTransactions");
  const activityLink = useLinkWithSearchParams("activity");

  const uncheckedProcedures = getUncheckedProcedures(procedures || []);
  const checkedProcedures = getCheckedProcedures(procedures || []);
  const activeProcedure = getActiveProcedure(procedures || []);
  const allProceduresCompleted = checkedProcedures.length === (procedures || []).length;
  const hasLoadingProcedures = getHasLoadingProcedures(procedures || []);

  const isLoading = getIsLoadingState(uncheckedProcedures?.[0]);
  const isBroadcasting = getIsBroadcastingState(uncheckedProcedures?.[0]);
  const isLeoWalletLoading = getIsLeoWalletLoadingState(uncheckedProcedures?.[0], activeWallet);

  const ctaText = useMemo(() => {
    if (!uncheckedProcedures?.[0])
      return type === "stake" || type === "redelegate" ? ctaTextMap.auth.idle : ctaTextMap.sign.idle;
    return ctaTextMap[uncheckedProcedures[0].step][uncheckedProcedures[0].state || "idle"];
  }, [uncheckedProcedures?.[0]?.step, uncheckedProcedures?.[0]?.state]);

  useEffect(() => {
    if (!open) return;

    const validInputState = inputState === "valid" || inputState === "safeMinInsufficient";
    if (connectionStatus === "disconnected" || ((type === "stake" || type === "unstake") && !validInputState)) {
      toggleOpen(false);
    }
  }, [connectionStatus, open, inputState]);

  useTxPostHogEvents({
    type: type === "withdraw" ? "claim" : type,
    open,
    amount: amountInputPad?.primaryValue || amount || "0",
    uncheckedProcedures,
    procedures,
  });

  return (
    <TransactionDialog.Shell
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (hasLoadingProcedures) {
            return;
          }

          if (open) {
            resetProceduresStates();
            queryClient.refetchQueries();
          }
          toggleOpen(!open);
        },
      }}
    >
      <TransactionDialog.TopBox title={title} type={type} />
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
            successLabel={explorerLabelMap[procedure.step]}
            explorerLink={procedure?.txHash && `${networkExplorerTx[network || defaultNetwork]}${procedure?.txHash}`}
          >
            {procedure.stepName}
          </TransactionDialog.StepItem>
        ))}
      </TransactionDialog.StepsBox>
      {isBroadcasting && <p className={S.slowTxWarning}>Now, we&apos;ll wait for broadcasting the tx.</p>}
      {!allProceduresCompleted && !isBroadcasting ? (
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
            amountInputPad?.setPrimaryValue("");
            resetProceduresStates();
            queryClient.refetchQueries();
            toggleOpen(false);
            isBroadcasting && togglePendingTransactionsDialog(true);
          }}
        />
      )}
    </TransactionDialog.Shell>
  );
};

const getUncheckedProcedures = (procedures: Array<TxProcedure>) => {
  return procedures.filter((procedure) => procedure.state !== "success");
};
const getCheckedProcedures = (procedures: Array<TxProcedure>) => {
  return procedures.filter((procedure) => procedure.state === "success");
};
const getHasLoadingProcedures = (procedures: Array<TxProcedure>) => {
  return procedures.some(
    (procedure) =>
      procedure.state === "preparing" || procedure.state === "loading" || procedure.state === "broadcasting",
  );
};
const getActiveProcedure = (procedures: Array<TxProcedure>) => {
  return procedures.find((procedure) => procedure.state !== "success");
};
const getIsLoadingState = (procedure: TxProcedure) => {
  return procedure?.state === "preparing" || procedure?.state === "loading" || procedure?.state === "broadcasting";
};
const getIsBroadcastingState = (procedure: TxProcedure) => {
  return procedure?.state === "broadcasting";
};
const getIsLeoWalletLoadingState = (procedure: TxProcedure, activeWallet: WalletStates["activeWallet"]) => {
  return activeWallet === "leoWallet" && (procedure?.state === "loading" || procedure?.state === "broadcasting");
};

const ctaTextMap: Record<TxProcedureStep, Record<TxProcedureState, string>> = {
  auth: {
    idle: "Approve",
    active: "Approve",
    preparing: "Preparing transaction",
    loading: "Proceed in the wallet",
    broadcasting: "Broadcasting transaction",
    success: "Approved",
    error: "Try again",
  },
  sign: {
    idle: "Confirm",
    active: "Confirm",
    preparing: "Preparing transaction",
    loading: "Proceed in the wallet",
    broadcasting: "Broadcasting transaction",
    success: "Confirmed",
    error: "Try again",
  },
};

const explorerLabelMap: Record<TxProcedureStep, string> = {
  auth: "Approved",
  sign: "Signed",
};
