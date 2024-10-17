"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useWallet } from "../../_contexts/WalletContext";
import { RootSendingTransactionsCapsule } from "./RootSendingTransactionsCapsule";
import { useSendingTransactions } from "../SendingTransactionsDialog";

export const SendingTransactionsCapsule = () => {
  const { connectionStatus } = useWallet();
  const { open, toggleOpen } = useDialog("sendingTransactions");
  const { hasSendingTransactions, isAllTransactionsCompleted, pendingTransactions } = useSendingTransactions();

  return (
    hasSendingTransactions &&
    connectionStatus === "connected" &&
    !open && (
      <RootSendingTransactionsCapsule
        onButtonClick={() => toggleOpen(true)}
        transactionsCount={pendingTransactions.length}
        isAllCompleted={isAllTransactionsCompleted}
      />
    )
  );
};
