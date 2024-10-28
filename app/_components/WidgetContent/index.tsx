"use client";

import { useEffect, useRef, type ReactNode } from "react";
import cn from "classnames";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useShell } from "@/app/_contexts/ShellContext";
import { useWallet } from "@/app/_contexts/WalletContext";
import { getTxResult } from "@/app/_services/aleo/utils";
import { useSendingTransactions } from "@/app/_components/SendingTransactionsDialog";

import * as S from "./widgetContent.css";

export type WidgetContentProps = {
  className?: string;
  variant?: "default" | "full";
  children: ReactNode;
};

export const WidgetContent = ({ className, variant = "default", children }: WidgetContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setStates } = useShell();
  const { sendingTransactions, setSendingTransactions } = useSendingTransactions();

  const { activeWallet: wallet, address, connectionStatus } = useWallet();
  const { wallet: leoWallet } = useLeoWallet();

  const checkSendingTransactions = async () => {
    for (const transaction of sendingTransactions) {
      const txId = transaction.txId;

      const txRes = await getTxResult({
        txId,
        wallet,
        leoWallet,
        address: address as string,
      });

      if (!!txRes?.status && txRes?.status !== "loading") {
        const status = txRes.status === "success" ? "success" : "failed";

        setSendingTransactions((prevTransactions) =>
          prevTransactions?.map((transaction) =>
            transaction.txId === txId ? { ...transaction, status } : transaction,
          ),
        );
      }
    }
  };

  useEffect(() => {
    connectionStatus === "connected" && checkSendingTransactions();
  }, [connectionStatus]);

  const setScrollActive = () => {
    setStates({ isScrollActive: !!ref.current?.scrollTop });
  };

  useEffect(() => {
    setStates({ isScrollActive: false });

    if (ref.current) {
      ref.current.addEventListener("scroll", setScrollActive);

      return () => {
        ref.current?.removeEventListener("scroll", setScrollActive);
      };
    }
  }, [ref.current]);

  return (
    <ScrollArea.Root className={cn(S.widgetContent, { [S.widgetContentFull]: variant === "full" })} scrollHideDelay={0}>
      <ScrollArea.Viewport ref={ref} className={cn(className, S.widgetWrapper)}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={S.scrollbar} orientation="vertical">
        <ScrollArea.Thumb className={S.thumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={S.corner} />
    </ScrollArea.Root>
  );
};
