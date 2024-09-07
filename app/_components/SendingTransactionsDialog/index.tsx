"use client";
import type { SendingTransaction } from "../../types";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import useLocalStorage from "use-local-storage";
import { RootSendingTransactionsDialog } from "./RootSendingTransactionsDialog";
import { defaultNetwork } from "@/app/consts";

export const SendingTransactionsDialog = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const { open, toggleOpen } = useDialog("sendingTransactions");

  const [sendingTransactions, setSendingTransactions] = useLocalStorage<Array<SendingTransaction>>(
    "sendingTransactions",
    [],
  );

  const networkSendingTransactions =
    sendingTransactions?.filter(
      (transaction) => transaction.network === (network || defaultNetwork) && transaction.address === address,
    ) || [];

  return (
    <RootSendingTransactionsDialog
      dialog={{
        open: !!open,
        onOpenChange: () => toggleOpen(!open),
      }}
      networkSendingTransactions={networkSendingTransactions}
      setSendingTransactions={setSendingTransactions}
    />
  );
};
