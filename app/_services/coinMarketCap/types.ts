import type { Network } from "../../types";
import { PriceConversionIdVariants, PriceConversionCurrencyVariants } from "./consts";

export type PriceConversionIdVariant = (typeof PriceConversionIdVariants)[number];
export type PriceConversionCurrencyVariant = (typeof PriceConversionCurrencyVariants)[number];

export type PriceConversionResponse = {
  data: {
    symbol: string;
    id: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
      [key: string]: Quote;
    };
  };
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
    notice: string;
  };
};

export type Quote = {
  price: number;
  last_updated: string;
};

export type GetCoinPriceProps = {
  network: Network;
  amount?: number;
  currency?: Array<PriceConversionCurrencyVariant>;
};
