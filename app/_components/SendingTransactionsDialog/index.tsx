"use client";
import type { SendingTransaction } from "../../types";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import useLocalStorage from "use-local-storage";
import { RootSendingTransactionsDialog } from "./RootSendingTransactionsDialog";
import { defaultNetwork, isAleoTestnet } from "@/app/consts";

export const SendingTransactionsDialog = () => {
  const { open, toggleOpen } = useDialog("sendingTransactions");
  const { sendingTransactions, setSendingTransactions } = useSendingTransactions();

  return (
    <RootSendingTransactionsDialog
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (open) {
            setSendingTransactions((prevTransactions) =>
              prevTransactions?.filter((transaction) => transaction.status === "pending"),
            );
          }
          toggleOpen(!open);
        },
      }}
      networkSendingTransactions={sendingTransactions}
      setSendingTransactions={setSendingTransactions}
    />
  );
};

export const useSendingTransactions = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const [sendingTransactions, setSendingTransactions] = useLocalStorage<Array<SendingTransaction>>(
    "sendingTransactions",
    [],
  );

  const transactions =
    sendingTransactions?.filter(
      (transaction) => transaction.network === (network || defaultNetwork) && transaction.address === address,
    ) || [];
  const networkSendingTransactions = transactions.filter((transaction) =>
    isAleoTestnet ? transaction.isAleoTestnet === true : transaction.isAleoTestnet === false,
  );
  const pendingTransactions = networkSendingTransactions.filter((transaction) => transaction.status === "pending");
  const isAllTransactionsCompleted = networkSendingTransactions.every(
    (transaction) => transaction.status !== "pending",
  );

  return {
    sendingTransactions: networkSendingTransactions,
    hasSendingTransactions: !!networkSendingTransactions.length,
    pendingTransactions,
    isAllTransactionsCompleted,
    setSendingTransactions,
  };
};
