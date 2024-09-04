"use client";
import type { PendingTransaction, WalletType } from "../../types";
import { useState } from "react";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_utils/hooks";
import useLocalStorage from "use-local-storage";
import { RootPendingTransactionsDialog } from "./RootPendingTransactionsDialog";
import { defaultNetwork } from "@/app/consts";

export const PendingTransactionsDialog = () => {
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const { setError } = useProceduralStates();

  const { network } = useShell();
  const { connectionStatus } = useWallet();
  const { open, toggleOpen } = useDialog("pendingTransactions");

  const [pendingTransactions, setPendingTransactions] = useLocalStorage<Array<PendingTransaction>>(
    "pendingTransactions",
    [],
  );

  const networkPendingTransactions =
    pendingTransactions?.filter((transaction) => transaction.network === (network || defaultNetwork)) || [];

  return (
    <RootPendingTransactionsDialog
      dialog={{
        open: !!open,
        onOpenChange: () => {
          if (open && connectionStatus === "connecting") {
            return;
          }

          if (open) {
            setError(null);
            setConnectingWallet(null);
          }
          toggleOpen(!open);
        },
      }}
      networkPendingTransactions={networkPendingTransactions}
    />
  );
};
