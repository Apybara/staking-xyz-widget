"use client";
import useLocalStorage from "use-local-storage";
import type { PendingTransaction } from "@/app/types";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { defaultNetwork } from "../../consts";
import { RootPendingTransactionsCapsule } from "./RootPendingTransactionsCapsule";

export const PendingTransactionsCapsule = () => {
  const { network } = useShell();
  const { connectionStatus, address } = useWallet();
  const { open, toggleOpen } = useDialog("pendingTransactions");
  const [transactions] = useLocalStorage<Array<PendingTransaction>>("pendingTransactions", []);

  const networkTransactions =
    transactions?.filter(
      (transaction) => transaction.network === (network || defaultNetwork) && transaction.address === address,
    ) || [];

  const pendingTransactions = networkTransactions.filter((transaction) => transaction.status === "pending");
  const isAllCompleted = networkTransactions.every((transaction) => transaction.status === "success");

  return (
    !!networkTransactions.length &&
    connectionStatus === "connected" &&
    !open && (
      <RootPendingTransactionsCapsule
        onButtonClick={() => toggleOpen(true)}
        transactionsCount={pendingTransactions.length}
        isAllCompleted={isAllCompleted}
      />
    )
  );
};
