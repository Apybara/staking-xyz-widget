import type { ReactNode } from "react";
import { assets, chains } from "chain-registry";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets as keplr } from "@cosmos-kit/keplr-extension";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as okxwallet } from "@cosmos-kit/okxwallet";
import { WalletConnectionDialog } from "../../_components/WalletConnectionDialog";
import celestiatestnet3Chains from "../../_services/cosmos/celestiatestnet3/chain.json";
import celestiatestnet3AssetList from "../../_services/cosmos/celestiatestnet3/assetlist.json";

export const CosmosKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ChainProvider
      chains={chainsList}
      assetLists={assetLists}
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

const chainsList = [chains.filter((chain) => chain.chain_id === "celestia")[0] || "celestia", celestiatestnet3Chains];
const assetLists = [assets.filter((asset) => asset.chain_name === "celestia")[0], celestiatestnet3AssetList];

const endpoints = {
  celestia: {
    rpc: [
      {
        url: "https://rpc.lunaroasis.net/",
        headers: {},
      },
    ],
    rest: [
      {
        url: "https://api.lunaroasis.net/",
        headers: {},
      },
    ],
  },
  celestiatestnet3: {
    rpc: [
      {
        url: "https://rpc-mocha.pops.one/",
        headers: {},
      },
    ],
    rest: [
      {
        url: "https://api-mocha.pops.one/",
        headers: {},
      },
    ],
  },
};
