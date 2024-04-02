import {
  NetworkVariants,
  NetworkDenomVariants,
  CosmosNetworkVariants,
  BaseCurrencyVariants,
  CosmosWalletVariants,
  WalletVariants,
  ConnectorVariants,
} from "./consts";

export type Network = (typeof NetworkVariants)[number];
export type NetworkInfo = {
  id: Network;
  name: string;
  logo: string;
  denom: string;
};

export type CosmosNetwork = (typeof CosmosNetworkVariants)[number];

export type BaseCurrency = (typeof BaseCurrencyVariants)[number];
export type NetworkDenom = (typeof NetworkDenomVariants)[number];
export type Currency = BaseCurrency | NetworkDenom;
export type CoinPrice = Record<Network, Record<BaseCurrency, number>>;

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
