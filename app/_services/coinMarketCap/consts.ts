import type { Network } from "../../types";
import type { PriceConversionIdVariant } from "./types";
import { FiatCurrencyVariants } from "../../consts";

export const PriceConversionIdVariants = [22861, 3794] as const; // TODO: Add Aleo ID
export const priceConversionIdVariants = [...PriceConversionIdVariants];

export const PriceConversionCurrencyVariants = FiatCurrencyVariants;
export const priceConversionCurrencyVariants = [...PriceConversionCurrencyVariants];

export const networkPriceConversionId: Record<Network, PriceConversionIdVariant> = {
  celestia: 22861,
  celestiatestnet3: 22861,
  cosmoshub: 3794,
  cosmoshubtestnet: 3794,
  aleo: 3794, // TODO: Add Aleo ID
};
