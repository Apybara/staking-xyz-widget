import moment from "moment";
import cn from "classnames";
import { useRouter } from "next/navigation";
import type { SendingTransaction } from "../../types";
import { useShell } from "@/app/_contexts/ShellContext";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import { getDynamicAssetValueFromCoin } from "@/app/_utils/conversions";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";

import * as S from "./sendingTransactionsDialog.css";
import Tooltip from "../Tooltip";
import { pluralize } from "@/app/_utils";

export type RootSendingTransactionsDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  networkSendingTransactions: Array<SendingTransaction>;
  setSendingTransactions: (txs: Array<SendingTransaction>) => void;
};

export const RootSendingTransactionsDialog = ({
  dialog,
  networkSendingTransactions,
  setSendingTransactions,
}: RootSendingTransactionsDialogProps) => {
  const router = useRouter();
  const { currency, coinPrice, network } = useShell();
  const activityLink = useLinkWithSearchParams("activity");

  const isSomeCompleted = networkSendingTransactions.some((transaction) => transaction.status === "success");
  const isAllCompleted = networkSendingTransactions.every((transaction) => transaction.status === "success");

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <Dialog.Title className={S.title}>
            <span>
              {isAllCompleted
                ? "All transactions sent!"
                : `Sending ${pluralize(networkSendingTransactions.length, "transaction")}`}
            </span>
            <Tooltip
              className={S.tooltip}
              trigger={<Icon name="info" />}
              content="The following transactions is currently being processed. Once transactions are finalized, they will appear on the Activity page."
            />
          </Dialog.Title>

          <ul className={S.list}>
            {networkSendingTransactions.map(({ title, timestamp, amount, status, txId }) => (
              <li key={`pending-transaction-${timestamp}`} className={S.item}>
                <div className={S.itemContent}>
                  {status === "success" ? (
                    <span className={S.checkIcon}>
                      <Icon name="sent" size={18} />
                    </span>
                  ) : (
                    <LoadingSpinner className={S.loadingIcon} size={18} />
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
                  isAllCompleted && setSendingTransactions([]);
                }}
              >
                View activity
              </button>
            )}
            <button
              className={S.dismissButton}
              onClick={() => {
                dialog.onOpenChange(false);
                isAllCompleted && setSendingTransactions([]);
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
