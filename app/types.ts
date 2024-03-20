import { NetworkVariants, BaseCurrencyVariants } from "./consts";

export type Network = (typeof NetworkVariants)[number];
export type NetworkInfo = {
  id: Network;
  name: string;
  logo: string;
  denom: string;
};

export type BaseCurrency = (typeof BaseCurrencyVariants)[number];
export type Currency = BaseCurrency | string;

export type RouterStruct = {
  searchParams?: {
    network?: string;
    currency?: string;
  };
};
