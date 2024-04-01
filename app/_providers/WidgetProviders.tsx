"use client";

import type { ReactNode } from "react";
import type { ShellProviderProps } from "../_contexts/ShellContext/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShellProvider } from "../_contexts/ShellContext";
import { WalletProvider } from "../_contexts/WalletContext";
import { UIContextProvider } from "../_contexts/UIContext";
import { WidgetProvider } from "../_contexts/WidgetContext";
import { CosmosProviders } from "./Cosmos";

export const WidgetProviders = ({
  initialCoinPrice,
  isOnMobileDevice,
  walletConnectAPIKey,
  children,
}: {
  initialCoinPrice: ShellProviderProps["initialCoinPrice"];
  isOnMobileDevice: ShellProviderProps["isOnMobileDevice"];
  walletConnectAPIKey: string;
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellProvider initialCoinPrice={initialCoinPrice} isOnMobileDevice={isOnMobileDevice}>
        <CosmosProviders walletConnectAPIKey={walletConnectAPIKey}>
          <WalletProvider>
            <UIContextProvider>
              <WidgetProvider>{children}</WidgetProvider>
            </UIContextProvider>
          </WalletProvider>
        </CosmosProviders>
      </ShellProvider>
    </QueryClientProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
