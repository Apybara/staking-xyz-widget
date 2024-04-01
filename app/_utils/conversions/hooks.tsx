"use client";

import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { networkDenom } from "../../consts";
import { getFormattedTokenValue, getFormattedCoinPrice } from ".";

export const useFormattedTokenPrice = ({ val }: { val?: string | number }) => {
  const { network, currency, coinPrice } = useShell();
  const castedNetwork = network || "celestia";
  const castedCurrency = currency || networkDenom[castedNetwork];
  const isFiatCurrency = castedCurrency === "USD" || castedCurrency === "EUR";

  if (!val) return undefined;

  if (!isFiatCurrency) {
    return getFormattedTokenValue({ val: BigNumber(val).toNumber() });
  }

  const price = coinPrice?.[castedNetwork]?.[castedCurrency] || 0;
  return getFormattedCoinPrice({
    val,
    price,
    currency: castedCurrency,
    options: {
      formatOptions: {
        currencySymbol: castedCurrency === "USD" ? "$" : "€",
      },
    },
  });
};
