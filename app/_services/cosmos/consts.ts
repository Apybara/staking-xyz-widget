import type { ChainInfo } from "@keplr-wallet/types";
import type { CosmosNetwork, CosmosTestnet } from "../../types";
import { networkEndpoints } from "../../consts";

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
const cosmoshub = {
  chainId: "cosmoshub-4",
  currencies: [
    {
      coinDenom: "atom",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  chainName: "cosmoshub",
  feeCurrencies: [
    {
      coinDenom: "atom",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  stakeCurrency: {
    coinDenom: "atom",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
    coinGeckoId: "cosmos",
  },
  bip44: {
    coinType: 118,
  },
};
const cosmoshubtestnet = {
  chainId: "theta-testnet-001",
  currencies: [
    {
      coinDenom: "atom",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
    },
  ],
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  chainName: "cosmoshubtestnet",
  feeCurrencies: [
    {
      coinDenom: "atom",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "atom",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
  },
  bip44: {
    coinType: 118,
  },
};

export const celestiaChainInfo: ChainInfo = {
  ...celestia,
  rpc: networkEndpoints.celestia.rpc,
  rest: networkEndpoints.celestia.rest,
};
export const celestiatestnet3ChainInfo: ChainInfo = {
  ...celestiatestnet3,
  rpc: networkEndpoints.celestiatestnet3.rpc,
  rest: networkEndpoints.celestiatestnet3.rest,
};
export const cosmoshubChainInfo: ChainInfo = {
  ...cosmoshub,
  rpc: networkEndpoints.cosmoshub.rpc,
  rest: networkEndpoints.cosmoshub.rest,
};
export const cosmoshubtestnetChainInfo: ChainInfo = {
  ...cosmoshubtestnet,
  rpc: networkEndpoints.cosmoshubtestnet.rpc,
  rest: networkEndpoints.cosmoshubtestnet.rest,
};

export const cosmosTestnetChainInfo: Record<CosmosTestnet, ChainInfo> = {
  celestiatestnet3: celestiatestnet3ChainInfo,
  cosmoshubtestnet: cosmoshubtestnetChainInfo,
};

export const cosmosChainInfoId: Record<CosmosNetwork, string> = {
  celestia: celestiaChainInfo.chainId,
  celestiatestnet3: celestiatestnet3ChainInfo.chainId,
  cosmoshub: cosmoshubChainInfo.chainId,
  cosmoshubtestnet: cosmoshubtestnetChainInfo.chainId,
};
