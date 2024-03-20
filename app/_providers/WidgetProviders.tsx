"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CosmosKitProvider } from "./CosmosKit";
import { WidgetProvider } from "../_contexts/WidgetContext";
import { WalletProvider } from "../_contexts/WalletContext";
import { UIContextProvider } from "../_contexts/UIContext";

export const WidgetProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider>
        <CosmosKitProvider>
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
