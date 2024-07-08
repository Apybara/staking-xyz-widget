import type { Network, Currency } from "../types";
import { networkCurrency, networkUrlParamRegex, currencyRegex } from "../consts";

export const removeLeadingAndTrailingZeros = (val: string) => {
  // Remove leading zeros except in cases like "0.01"
  const noLeadingZeros = val.replace(/^0+(?!\.)/, "");

  // Split the string into integer and decimal parts
  const [integerString, decimalString] = noLeadingZeros.split(".");

  if (!decimalString) {
    // If there's no decimal part, return the integer string directly
    return integerString;
  }

  // Remove trailing zeros in the decimal part, if any
  const trimmedDecimalString = decimalString.replace(/0+$/, "");

  // If the decimal part becomes empty after trimming, return just the integer part
  if (trimmedDecimalString === "") {
    return integerString;
  }

  // Otherwise, recombine the integer and non-empty decimal part
  return `${integerString}.${trimmedDecimalString}`;
};

export const getIsNetworkValid = (network?: string) => network && networkUrlParamRegex.test(network);
export const getIsCurrencyValid = (currency?: string) => currencyRegex.test(currency || "");

export const getIsNetworkCurrencyPairValid = (network?: string, currency?: string) => {
  const isNetworkValid = getIsNetworkValid(network);
  const isCurrencyValid = getIsCurrencyValid(currency);

  if (!isNetworkValid || !isCurrencyValid) return false;

  const upperCaseCurrency = (currency || "").toUpperCase();

  switch (network as Network) {
    case "celestia":
      return networkCurrency.celestia === upperCaseCurrency;
    case "celestiatestnet3":
      return networkCurrency.celestiatestnet3 === upperCaseCurrency;
    case "cosmoshub":
      return networkCurrency.cosmoshub === upperCaseCurrency;
    case "cosmoshubtestnet":
      return networkCurrency.cosmoshubtestnet === upperCaseCurrency;
    case "aleo":
      return networkCurrency.aleo === upperCaseCurrency;
  }
};
