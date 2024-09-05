import moment from "moment";
import cn from "classnames";
import { useRouter } from "next/navigation";
import type { PendingTransaction } from "../../types";
import { useShell } from "@/app/_contexts/ShellContext";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import { getDynamicAssetValueFromCoin } from "@/app/_utils/conversions";
import * as TransactionDialog from "../../_components/TransactionDialog";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";

import * as S from "./pendingTransactionsDialog.css";

export type RootPendingTransactionsDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  networkPendingTransactions: Array<PendingTransaction>;
  setPendingTransactions: (transaction: Array<PendingTransaction>) => void;
};

export const RootPendingTransactionsDialog = ({
  dialog,
  networkPendingTransactions,
  setPendingTransactions,
}: RootPendingTransactionsDialogProps) => {
  const router = useRouter();
  const { currency, coinPrice, network } = useShell();
  const activityLink = useLinkWithSearchParams("activity");

  const isSomeCompleted = networkPendingTransactions.some((transaction) => transaction.status === "success");
  const isAllCompleted = networkPendingTransactions.every((transaction) => transaction.status === "success");

  const clearTransaction = (txId: string) => {
    const newPendingTransactions = networkPendingTransactions.filter((transaction) => transaction.txId !== txId);
    setPendingTransactions(newPendingTransactions);
  };

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <Dialog.Title className={S.title}>
            {isAllCompleted ? "All transactions confirmed!" : "Pending transactions"}
          </Dialog.Title>

          <ul className={S.list}>
            {networkPendingTransactions.map(({ title, timestamp, amount, status, txId }) => (
              <li key={`pending-transaction-${timestamp}`} className={S.item}>
                <div className={S.itemContent}>
                  {status === "success" ? (
                    <span className={S.checkIcon}>
                      <Icon name="circleCheck" size={16} />
                    </span>
                  ) : (
                    <LoadingSpinner className={S.loadingIcon} size={16} />
                  )}

                  <div className={S.infoContainer}>
                    <div className={S.itemInfo}>
                      <div className={S.titleContainer}>
                        <h5 className={cn(S.itemTitle)}>{title}</h5>
                        <p className={cn(S.itemSubtitle)}>{moment(timestamp).fromNow()}</p>
                      </div>
                      <h5 className={cn(S.itemTitle)}>
                        {getDynamicAssetValueFromCoin({ currency, coinPrice, network, coinVal: amount })}
                      </h5>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={S.actions}>
            {isSomeCompleted && (
              <button
                className={S.activityButton}
                onClick={() => {
                  router.push(activityLink);
                  dialog.onOpenChange(false);
                }}
              >
                View activity
              </button>
            )}
            <button
              className={S.dismissButton}
              onClick={() => {
                dialog.onOpenChange(false);
                isAllCompleted && setPendingTransactions([]);
              }}
            >
              Dismiss
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
