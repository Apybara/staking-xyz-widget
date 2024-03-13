"use client";

import type { ReactNode } from "react";
import { GrazProvider as Provider } from "graz";

export const GrazProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider
      grazOptions={{
        chains: CHAINS,
      }}
    >
      {children}
    </Provider>
  );
};

const celestiaConfigs = {
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "celestia",
    bech32PrefixAccPub: "celestia" + "pub",
    bech32PrefixValAddr: "celestia" + "valoper",
    bech32PrefixValPub: "celestia" + "valoperpub",
    bech32PrefixConsAddr: "celestia" + "valcons",
    bech32PrefixConsPub: "celestia" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "TIA",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
      coinGeckoId: "celestia",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "TIA",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
      coinGeckoId: "celestia",
      gasPriceStep: {
        low: 0.01,
        average: 0.02,
        high: 0.1,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "TIA",
    coinMinimalDenom: "utia",
    coinDecimals: 6,
    coinGeckoId: "celestia",
  },
};
const celestia = {
  ...celestiaConfigs,
  chainId: "celestia",
  chainName: "Celestia",
  rpc: "https://rpc.lunaroasis.net/",
  rest: "https://api.lunaroasis.net/",
};
const mocha4 = {
  ...celestiaConfigs,
  chainId: "mocha-4",
  chainName: "Mocha testnet",
  rpc: "https://rpc-mocha.pops.one/",
  rest: "https://api-mocha.pops.one/",
};

export const CHAINS = [celestia, mocha4];
export const CHAIN = {
  CELESTIA: celestia,
  MOCHA4: mocha4,
};
