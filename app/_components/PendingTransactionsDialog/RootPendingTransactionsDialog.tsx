import moment from "moment";
import cn from "classnames";
import type { PendingTransaction } from "../../types";
import { useShell } from "@/app/_contexts/ShellContext";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";
import { getDynamicAssetValueFromCoin } from "@/app/_utils/conversions";

import * as S from "./pendingTransactionsDialog.css";

export type RootPendingTransactionsDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  networkPendingTransactions: Array<PendingTransaction>;
};

export const RootPendingTransactionsDialog = ({
  dialog,
  networkPendingTransactions,
}: RootPendingTransactionsDialogProps) => {
  const { currency, coinPrice, network } = useShell();

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <Dialog.Title className={S.title}>Pending transactions</Dialog.Title>

          <ul className={S.list}>
            {networkPendingTransactions.map(({ title, timestamp, amount, status }) => (
              <li key={`pending-transaction-${timestamp}`} className={S.item}>
                <div className={S.itemContent}>
                  {status === "success" ? (
                    <span className={S.checkIcon}>
                      <Icon name="circleCheck" />
                    </span>
                  ) : (
                    <LoadingSpinner className={S.loadingIcon} />
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

                {status === "success" && (
                  <button className={S.activityButton}>
                    <span>View activity</span>
                    <span className={S.activityButtonArrow}>
                      <Icon name="arrow" />
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button className={S.minimizeButton} onClick={() => dialog.onOpenChange(false)}>
            Minimize
          </button>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
