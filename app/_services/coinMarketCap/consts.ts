import type { Network } from "../../types";
import type { PriceConversionIdVariant } from "./types";
import { BaseCurrencyVariants } from "../../consts";

export const PriceConversionIdVariants = [22861] as const;
export const priceConversionIdVariants = [...PriceConversionIdVariants];

export const PriceConversionCurrencyVariants = BaseCurrencyVariants;
export const priceConversionCurrencyVariants = [...PriceConversionCurrencyVariants];

export const networkPriceConversionId: Record<Network, PriceConversionIdVariant> = {
  celestia: 22861,
  celestiatestnet3: 22861,
};
