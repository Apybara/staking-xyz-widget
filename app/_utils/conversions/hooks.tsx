"use client";

import BigNumber from "bignumber.js";
import { useWidget } from "../../_contexts/WidgetContext";
import { networkDenom } from "../../consts";
import { getFormattedTokenValue, getFormattedCoinPrice } from ".";

export const useFormattedTokenPrice = ({ val }: { val?: string | number }) => {
  const { network, currency, coinPrice } = useWidget();
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
