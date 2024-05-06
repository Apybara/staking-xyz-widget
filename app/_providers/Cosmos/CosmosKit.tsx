import type { ReactNode } from "react";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets as keplr } from "@cosmos-kit/keplr-extension";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as okxwallet } from "@cosmos-kit/okxwallet";
import { WalletConnectionDialog } from "../../_components/WalletConnectionDialog";
import { cosmosKitChains, cosmosKitAssets } from "../../_services/cosmos/cosmosKit/consts";
import { networkEndpoints } from "../../consts";

export const CosmosKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ChainProvider
      chains={cosmosKitChains}
      assetLists={cosmosKitAssets}
      wallets={[...keplr, ...leap, ...okxwallet]}
      endpointOptions={{
        isLazy: true,
        endpoints,
      }}
      walletModal={WalletConnectionDialog}
      disableIframe={false}
      subscribeConnectEvents={true}
      // logLevel={"DEBUG"}
    >
      {children}
    </ChainProvider>
  );
};

const endpoints = {
  celestia: {
    rpc: [
      {
        url: networkEndpoints.celestia.rpc,
        headers: {},
      },
    ],
    rest: [
      {
        url: networkEndpoints.celestia.rest,
        headers: {},
      },
    ],
  },
  celestiatestnet3: {
    rpc: [
      {
        url: networkEndpoints.celestiatestnet3.rpc,
        headers: {},
      },
    ],
    rest: [
      {
        url: networkEndpoints.celestiatestnet3.rest,
        headers: {},
      },
    ],
  },
};
