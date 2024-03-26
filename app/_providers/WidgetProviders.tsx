"use client";

import type { ReactNode } from "react";
import type { WidgetProviderProps } from "../_contexts/WidgetContext/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CosmosKitProvider } from "./CosmosKit";
import { WidgetProvider } from "../_contexts/WidgetContext";
import { WalletProvider } from "../_contexts/WalletContext";
import { UIContextProvider } from "../_contexts/UIContext";

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
        <CosmosKitProvider walletConnectAPIKey={walletConnectAPIKey}>
          <WalletProvider>
            <UIContextProvider>{children}</UIContextProvider>
          </WalletProvider>
        </CosmosKitProvider>
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
