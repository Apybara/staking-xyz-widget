import {
  NetworkVariants,
  CoinVariants,
  CosmosNetworkVariants,
  FiatCurrencyVariants,
  CosmosWalletVariants,
  WalletVariants,
  ConnectorVariants,
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

export type FiatCurrency = (typeof FiatCurrencyVariants)[number];
export type NetworkCurrency = (typeof CoinVariants)[number];
export type Currency = FiatCurrency | NetworkCurrency;
export type CoinPrice = Record<Network, Record<FiatCurrency, number>>;

export type CosmosWalletType = (typeof CosmosWalletVariants)[number];
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
};
export type ConnectorType = (typeof ConnectorVariants)[number];
export type WalletConnectionStatus = "connecting" | "connected" | "disconnecting" | "disconnected";

export type RouterStruct = {
  searchParams?: {
    network?: string;
    currency?: string;
    device?: Device;
  };
};

type Device = "mobile" | "desktop";
