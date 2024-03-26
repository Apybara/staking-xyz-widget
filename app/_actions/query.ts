"use server";

import type { Network } from "../types";
import { revalidateTag } from "next/cache";
import { networkCoinPriceSymbol } from "../consts";

export const revalidatePageQueries = (network?: string) => {
  if (!network) return;
  revalidateTag("coin-price" + networkCoinPriceSymbol[network as Network]);
};
