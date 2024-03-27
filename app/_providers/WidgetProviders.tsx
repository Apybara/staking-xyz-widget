"use client";

import type { ReactNode } from "react";
import type { WidgetProviderProps } from "../_contexts/WidgetContext/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WidgetProvider } from "../_contexts/WidgetContext";
import { WalletProvider } from "../_contexts/WalletContext";
import { UIContextProvider } from "../_contexts/UIContext";
import { CosmosProviders } from "./Cosmos";

export const WidgetProviders = ({
  initialCoinPrice,
  isOnMobileDevice,
  walletConnectAPIKey,
  children,
}: {
  initialCoinPrice: WidgetProviderProps["initialCoinPrice"];
  isOnMobileDevice: WidgetProviderProps["isOnMobileDevice"];
  walletConnectAPIKey: string;
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider initialCoinPrice={initialCoinPrice} isOnMobileDevice={isOnMobileDevice}>
        <CosmosProviders walletConnectAPIKey={walletConnectAPIKey}>
          <WalletProvider>
            <UIContextProvider>{children}</UIContextProvider>
          </WalletProvider>
        </CosmosProviders>
      </WidgetProvider>
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
