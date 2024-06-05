import type { ReactNode } from "react";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets as keplr } from "@cosmos-kit/keplr-extension";
import { wallets as keplrMobile } from "@cosmos-kit/keplr-mobile";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as leapMobile } from "@cosmos-kit/leap-mobile";
import { wallets as okxwallet } from "@cosmos-kit/okxwallet";
import { WalletConnectionDialog } from "../../_components/WalletConnectionDialog";
import { cosmosKitChains, cosmosKitAssets } from "../../_services/cosmos/cosmosKit/consts";
import { networkEndpoints, SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_WALLET_CONNECT_LOGO } from "../../consts";

export const CosmosKitProvider = ({
  walletConnectAPIKey,
  children,
}: {
  walletConnectAPIKey: string;
  children: ReactNode;
}) => {
  return (
    <ChainProvider
      chains={cosmosKitChains}
      assetLists={cosmosKitAssets}
      wallets={[...keplr, ...keplrMobile, ...leap, ...leapMobile, ...okxwallet]}
      endpointOptions={{
        isLazy: true,
        endpoints,
      }}
      walletModal={WalletConnectionDialog}
      subscribeConnectEvents={true}
      walletConnectOptions={{
        signClient: {
          projectId: walletConnectAPIKey,
          relayUrl: "wss://relay.walletconnect.org",
          metadata: {
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            url: SITE_URL,
            icons: [SITE_WALLET_CONNECT_LOGO],
          },
        },
      }}
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
  cosmoshub: {
    rpc: [
      {
        url: networkEndpoints.cosmoshub.rpc,
        headers: {},
      },
    ],
    rest: [
      {
        url: networkEndpoints.cosmoshub.rest,
        headers: {},
      },
    ],
  },
  cosmoshubtestnet: {
    rpc: [
      {
        url: networkEndpoints.cosmoshubtestnet.rpc,
        headers: {},
      },
    ],
    rest: [
      {
        url: networkEndpoints.cosmoshubtestnet.rest,
        headers: {},
      },
    ],
  },
};
