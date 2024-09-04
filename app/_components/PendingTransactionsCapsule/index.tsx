"use client";
import useLocalStorage from "use-local-storage";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { walletsInfo, defaultNetwork } from "../../consts";
import { RootPendingTransactionsCapsule } from "./RootPendingTransactionsCapsule";
import type { PendingTransaction } from "@/app/types";

export const PendingTransactionsCapsule = () => {
  const { network } = useShell();
  const { connectionStatus, activeWallet, address } = useWallet();
  const { toggleOpen } = useDialog("pendingTransactions");
  const [pendingTransactions] = useLocalStorage<Array<PendingTransaction>>("pendingTransactions", []);

  const networkPendingTransactions =
    pendingTransactions?.filter((transaction) => transaction.network === (network || defaultNetwork)) || [];

  return (
    !!networkPendingTransactions.length && (
      <RootPendingTransactionsCapsule
        state={connectionStatus === "disconnecting" ? "disconnected" : connectionStatus}
        wallet={
          activeWallet && address
            ? {
                info: walletsInfo[activeWallet],
                address,
              }
            : undefined
        }
        onButtonClick={() => toggleOpen(true)}
        transactionsCount={networkPendingTransactions.length}
      />
    )
  );
};
