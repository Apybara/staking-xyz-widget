import {
  NetworkVariants,
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
export type Currency = BaseCurrency | string;

export type CosmosWalletType = (typeof CosmosWalletVariants)[number];
export type WalletType = (typeof WalletVariants)[number];
export type WalletInfo = {
  id: WalletType;
  name: string;
  logo: string;
};
export type NetworkWalletType = {
  celestia: CosmosWalletType[];
  "mocha-4": CosmosWalletType[];
};
export type ConnectorType = (typeof ConnectorVariants)[number];

export type RouterStruct = {
  searchParams?: {
    network?: string;
    currency?: string;
  };
};
