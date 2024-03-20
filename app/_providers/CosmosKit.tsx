"use client";

import type { ReactNode } from "react";
import { assets, chains } from "chain-registry";
import { ChainProvider } from '@cosmos-kit/react-lite';
import { wallets as keplr } from '@cosmos-kit/keplr';
import { wallets as leap } from "@cosmos-kit/leap";
import { wallets as okxwallet } from "@cosmos-kit/okxwallet";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../consts";

export const CosmosKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ChainProvider
      chains={chainsList}
      assetLists={assetLists}
      wallets={[keplr[0], leap[0], ...okxwallet]}
      endpointOptions={{
        isLazy: true,
        endpoints,
      }}
      walletModal={WalletConnectionDialog}
      // walletConnectOptions={{
      //   signClient: {
      //     projectId: "",
      //     relayUrl: "",
      //     metadata: {
      //       name: SITE_TITLE,
      //       description: SITE_DESCRIPTION,
      //       url: SITE_URL,
      //       icons: [""],
      //     },
      //   },
      // }}
      subscribeConnectEvents={true}
    // logLevel={"DEBUG"}
    >
      {children}
    </ChainProvider >
  );
};


const chainsList = [
  chains.find((chain) => chain.chain_id === 'celestia') || 'celestia',
  chains.find((chain) => chain.chain_id === 'mocha-4') || 'mocha-4',
]
const assetLists = assets.filter((asset) => asset.chain_name === 'celestia');

const endpoints = {
  'celestia': {
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
      }
    ]
  },
  'celestiatestnet3': {
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
      }
    ]
  },
}