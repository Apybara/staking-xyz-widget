import {
  NetworkVariants,
  CoinVariants,
  CosmosNetworkVariants,
  cosmosTestnetVariants,
  FiatCurrencyVariants,
  CosmosWalletVariants,
  WalletVariants,
  AleoWalletVariants,
  AleoNetworkVariants,
} from "./consts";

export type Network = (typeof NetworkVariants)[number];
export type NetworkInfo = {
  id: Network;
  name: string;
  logo: string;
  currency: NetworkCurrency;
  denom: string;
};

export type CosmosNetwork = (typeof CosmosNetworkVariants)[number];
export type CosmosTestnet = (typeof cosmosTestnetVariants)[number];
export type AleoNetwork = (typeof AleoNetworkVariants)[number];

export type FiatCurrency = (typeof FiatCurrencyVariants)[number];
export type NetworkCurrency = (typeof CoinVariants)[number];
export type Currency = FiatCurrency | NetworkCurrency;
export type CoinPrice = Record<Network, Record<FiatCurrency, number>>;

export type CosmosWalletType = (typeof CosmosWalletVariants)[number];
export type AleoWalletType = (typeof AleoWalletVariants)[number];

export type WalletType = (typeof WalletVariants)[number];
export type WalletInfo = {
  id: WalletType;
  name: string;
  logo: string;
  downloadLink?: string;
  devicesSupport: Array<Device>;
};
export type NetworkWalletType = {
  celestia: CosmosWalletType[];
  celestiatestnet3: CosmosWalletType[];
  cosmoshub: CosmosWalletType[];
  cosmoshubtestnet: CosmosWalletType[];
};
export type WalletConnectionStatus = "connecting" | "connected" | "disconnecting" | "disconnected";

export type RouterStruct = {
  searchParams?: {
    network?: string;
    currency?: string;
    device?: Device;
  };
};

export type TxType = "stake" | "unstake" | "redelegate" | "claim";

type Device = "mobile" | "desktop";
