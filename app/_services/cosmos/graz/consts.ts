import type { ChainInfo } from "@keplr-wallet/types";
import type { CosmosNetwork } from "../../../types";

export const GrazWalletVariants = ["keplrMobile", "leapMobile", "walletConnect"] as const;
export const grazWalletVariants = [...GrazWalletVariants];

const celestia = {
  chainId: "celestia",
  currencies: [
    {
      coinDenom: "tia",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
      coinGeckoId: "celestia",
    },
  ],
  bech32Config: {
    bech32PrefixAccAddr: "celestia",
    bech32PrefixAccPub: "celestiapub",
    bech32PrefixValAddr: "celestiavaloper",
    bech32PrefixValPub: "celestiavaloperpub",
    bech32PrefixConsAddr: "celestiavalcons",
    bech32PrefixConsPub: "celestiavalconspub",
  },
  chainName: "celestia",
  feeCurrencies: [
    {
      coinDenom: "tia",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
      coinGeckoId: "celestia",
    },
  ],
  stakeCurrency: {
    coinDenom: "tia",
    coinMinimalDenom: "utia",
    coinDecimals: 6,
    coinGeckoId: "celestia",
  },
  bip44: {
    coinType: 118,
  },
};
const celestiatestnet3 = {
  chainId: "mocha-4",
  currencies: [
    {
      coinDenom: "tia",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
    },
  ],
  bech32Config: {
    bech32PrefixAccAddr: "celestia",
    bech32PrefixAccPub: "celestiapub",
    bech32PrefixValAddr: "celestiavaloper",
    bech32PrefixValPub: "celestiavaloperpub",
    bech32PrefixConsAddr: "celestiavalcons",
    bech32PrefixConsPub: "celestiavalconspub",
  },
  chainName: "celestiatestnet3",
  feeCurrencies: [
    {
      coinDenom: "tia",
      coinMinimalDenom: "utia",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "tia",
    coinMinimalDenom: "utia",
    coinDecimals: 6,
  },
  bip44: {
    coinType: 118,
  },
};

export const celestiaChainInfo: ChainInfo = {
  ...celestia,
  rpc: "https://rpc.lunaroasis.net/",
  rest: "https://api.lunaroasis.net/",
};
export const celestiatestnet3ChainInfo: ChainInfo = {
  ...celestiatestnet3,
  rpc: "https://rpc-mocha.pops.one/",
  rest: "https://api-mocha.pops.one/",
};

export const chainInfo: Record<CosmosNetwork, ChainInfo> = {
  celestia: celestiaChainInfo,
  celestiatestnet3: celestiatestnet3ChainInfo,
};
