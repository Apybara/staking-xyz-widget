"use client";
import type { PendingTransaction } from "../../types";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import useLocalStorage from "use-local-storage";
import { RootPendingTransactionsDialog } from "./RootPendingTransactionsDialog";
import { defaultNetwork } from "@/app/consts";

export const PendingTransactionsDialog = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const { open, toggleOpen } = useDialog("pendingTransactions");

  const [pendingTransactions, setPendingTransactions] = useLocalStorage<Array<PendingTransaction>>(
    "pendingTransactions",
    [],
  );

  const networkPendingTransactions =
    pendingTransactions?.filter(
      (transaction) => transaction.network === (network || defaultNetwork) && transaction.address === address,
    ) || [];

  return (
    <RootPendingTransactionsDialog
      dialog={{
        open: !!open,
        onOpenChange: () => toggleOpen(!open),
      }}
      networkPendingTransactions={networkPendingTransactions}
      setPendingTransactions={setPendingTransactions}
    />
  );
};
