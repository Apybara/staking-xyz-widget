import type { SendingTransaction } from "../../types";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { useShell } from "@/app/_contexts/ShellContext";
import { pluralize } from "@/app/_utils";
import { useLinkWithSearchParams } from "@/app/_utils/clientRoutes";
import { getDynamicAssetValueFromCoin } from "@/app/_utils/conversions";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";
import Tooltip from "../Tooltip";
import { TimeText } from "./TimeText";
import * as S from "./sendingTransactionsDialog.css";

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

  const isSomeCompleted = networkSendingTransactions.some((transaction) => transaction.status !== "pending");
  const isAllCompleted = networkSendingTransactions.every((transaction) => transaction.status !== "pending");

  const formattedTransactionsText = pluralize({ value: networkSendingTransactions.length, unit: "transaction" });
  const formattedTransactionsTextWithVerb = pluralize({
    value: networkSendingTransactions.length,
    unit: "transaction",
    addVerb: true,
  });

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <Dialog.Title className={S.title}>
            <span>{isAllCompleted ? "All transactions sent!" : `Sending ${formattedTransactionsText}`}</span>
            <Tooltip
              className={S.tooltip}
              trigger={<Icon name="info" />}
              content={`The following ${formattedTransactionsTextWithVerb} currently being processed. Once transactions are finalized, they will appear on the Activity page.`}
            />
          </Dialog.Title>

          <ul className={S.list}>
            {networkSendingTransactions.map(({ title, timestamp, amount, status, txId }) => (
              <li key={`pending-transaction-${timestamp}`} className={S.item}>
                <div className={S.itemContent}>
                  {status === "pending" ? (
                    <LoadingSpinner className={S.loadingIcon} size={18} />
                  ) : (
                    <span className={cn(S.statusIcon({ state: status }))}>
                      <Icon name={status === "success" ? "sent" : "circleCross"} size={18} />
                    </span>
                  )}

                  <div className={S.infoContainer}>
                    <div className={S.itemInfo}>
                      <div className={S.titleContainer}>
                        <h5 className={cn(S.itemTitle)}>{title}</h5>
                        <TimeText timestamp={timestamp} />
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
