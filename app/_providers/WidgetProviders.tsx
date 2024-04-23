"use client";
import type { ReactNode } from "react";
import type { ShellProviderProps } from "../_contexts/ShellContext/types";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShellProvider } from "../_contexts/ShellContext";
import { WalletProvider } from "../_contexts/WalletContext";
import { UIContextProvider } from "../_contexts/UIContext";
import { WidgetProvider } from "../_contexts/WidgetContext";
import { CosmosProviders } from "./Cosmos";
import { PostHogProvider } from "./PostHog";

const PostHogPageView = dynamic(
  async () => {
    const { PostHogPageView } = await import("./PostHog");
    return PostHogPageView;
  },
  {
    ssr: false,
  },
);

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
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <ShellProvider initialCoinPrice={initialCoinPrice} isOnMobileDevice={isOnMobileDevice}>
          <CosmosProviders walletConnectAPIKey={walletConnectAPIKey}>
            <WalletProvider>
              <UIContextProvider>
                <WidgetProvider>
                  <PostHogPageView />
                  {children}
                </WidgetProvider>
              </UIContextProvider>
            </WalletProvider>
          </CosmosProviders>
        </ShellProvider>
      </QueryClientProvider>
    </PostHogProvider>
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
