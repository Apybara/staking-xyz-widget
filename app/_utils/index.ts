import type { FiatCurrency, Network, StakingType } from "../types";
import { networkCurrency, networkUrlParamRegex, currencyRegex, fiatCurrencyVariants } from "../consts";

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

export const pluralize = ({ value, unit, addVerb }: { value: number; unit: string; addVerb?: boolean }) => {
  const isSingular = value === 1;

  return isSingular ? `${unit}${addVerb ? " is" : ""}` : `${unit}s${addVerb ? " are" : ""}`;
};

export const getIsNetworkValid = (network?: string) => network && networkUrlParamRegex.test(network);
export const getIsCurrencyValid = (currency?: string) => currencyRegex.test(currency || "");

export const getIsNetworkCurrencyPairValid = ({
  network,
  currency,
  page,
  stakingType,
}: {
  network?: string;
  currency?: string;
  page?: string;
  stakingType?: StakingType;
}) => {
  const isNetworkValid = getIsNetworkValid(network) || networkUrlParamRegex.test(network || "");
  const isCurrencyValid = getIsCurrencyValid(currency);
  const isAleoLiquidUnstakePage = network === "aleo" && page === "unstake" && stakingType === "liquid";

  if (!isNetworkValid || !isCurrencyValid) return false;

  const upperCaseCurrency = (currency || "").toUpperCase();

  if (fiatCurrencyVariants.includes(upperCaseCurrency as FiatCurrency)) {
    return !isAleoLiquidUnstakePage;
  }

  switch (network as Network | (string & {})) {
    case "celestia":
      return networkCurrency.celestia === upperCaseCurrency;
    case "celestiatestnet3":
    case "celestiatestnet":
      return networkCurrency.celestiatestnet3 === upperCaseCurrency;
    case "cosmoshub":
      return networkCurrency.cosmoshub === upperCaseCurrency;
    case "cosmoshubtestnet":
      return networkCurrency.cosmoshubtestnet === upperCaseCurrency;
    case "aleo":
      return networkCurrency.aleo === upperCaseCurrency;
  }
};
