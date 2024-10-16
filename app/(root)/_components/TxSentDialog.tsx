"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDialog } from "../../_contexts/UIContext";
import * as TransactionDialog from "../../_components/TransactionDialog";
import { useLinkWithSearchParams } from "../../_utils/routes";

import * as S from "../../_components/TransactionDialog/delegationDialog.css";

export const TxSentDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { open, toggleOpen } = useDialog("txSent");
  const activityLink = useLinkWithSearchParams("activity");

  return (
    <TransactionDialog.Shell
      className={S.txSentDialog}
      dialog={{
        open: !!open,
        onOpenChange: () => toggleOpen(!open),
      }}
    >
      <TransactionDialog.TopBox
        className={S.txSentTopBox}
        title="Transaction sent"
        type="stake"
        isAssistiveVisualActive={false}
      />

      <TransactionDialog.StepsBox>
        <p className={S.sentText}>
          The transaction will show up in the activity page in 2-3 minutes if it&apos;s successful.
        </p>
      </TransactionDialog.StepsBox>

      <TransactionDialog.SentButtons
        onActivityButtonClick={() => router.push(activityLink)}
        onDismissButtonClick={() => {
          queryClient.refetchQueries();
          toggleOpen(false);
        }}
      />
    </TransactionDialog.Shell>
  );
};
