import type { Network } from "../../types";
import type { PriceConversionIdVariant } from "./types";
import { FiatCurrencyVariants } from "../../consts";

export const PriceConversionIdVariants = [22861] as const;
export const priceConversionIdVariants = [...PriceConversionIdVariants];

export const PriceConversionCurrencyVariants = FiatCurrencyVariants;
export const priceConversionCurrencyVariants = [...PriceConversionCurrencyVariants];

export const networkPriceConversionId: Record<Network, PriceConversionIdVariant> = {
  celestia: 22861,
  celestiatestnet3: 22861,
  cosmoshub: 22861, // @vince to provide value
  cosmoshubtestnet: 22861, // @vince to provide value
};
