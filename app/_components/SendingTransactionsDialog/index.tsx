"use client";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import type { SendingTransaction } from "../../types";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import useLocalStorage from "use-local-storage";
import { getTxResult } from "@/app/_services/aleo/utils";
import { RootSendingTransactionsDialog } from "./RootSendingTransactionsDialog";
import { defaultNetwork, isAleoTestnet } from "@/app/consts";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { eventActionMap } from "@/app/_services/postHog/consts";
import { txProcedureMap } from "@/app/consts";

export const SendingTransactionsDialog = () => {
  const { open, toggleOpen } = useDialog("sendingTransactions");
  const { sendingTransactions, setSendingTransactions } = useSendingTransactions();

  const { activeWallet: wallet, address, connectionStatus } = useWallet();
  const { wallet: leoWallet } = useLeoWallet();

  const posthog = usePostHog();

  const checkSendingTransactions = async () => {
    for (const transaction of sendingTransactions) {
      const txId = transaction.txId;
      const type = transaction.type;
      const isTrackedOnPosthog = transaction.isTrackedOnPosthog;

      const txRes = await getTxResult({
        txId,
        wallet,
        leoWallet,
        address: address as string,
      });

      if (!!txRes?.status && txRes?.status !== "loading") {
        const status = txRes.status === "success" ? "success" : "failed";
        const formattedType = txProcedureMap[type];
        const action = eventActionMap[formattedType];

        !isTrackedOnPosthog &&
          posthog.capture(
            status === "success"
              ? `${formattedType}_tx_flow${action}_succeeded`
              : `${formattedType}_tx_flow${action}_failed`,
          );

        setSendingTransactions((prevTransactions) =>
          prevTransactions?.map((transaction) =>
            transaction.txId === txId ? { ...transaction, status, isTrackedOnPosthog: true } : transaction,
          ),
        );
      }
    }
  };

  useEffect(() => {
    connectionStatus === "connected" && checkSendingTransactions();
  }, [connectionStatus]);

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
