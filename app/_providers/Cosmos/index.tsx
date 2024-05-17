import type { ReactNode } from "react";
import { GrazProvider } from "./Graz";
import { CosmosKitProvider } from "./CosmosKit";

export const CosmosProviders = ({
  walletConnectAPIKey,
  children,
}: {
  walletConnectAPIKey: string;
  children: ReactNode;
}) => {
  return (
    <GrazProvider walletConnectAPIKey={walletConnectAPIKey}>
      <CosmosKitProvider walletConnectAPIKey={walletConnectAPIKey}>{children}</CosmosKitProvider>
    </GrazProvider>
  );
};
