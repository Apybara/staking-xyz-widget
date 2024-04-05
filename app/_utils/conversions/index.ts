import type { FiatCurrency } from "../../types";
import BigNumber from "bignumber.js";
import numbro from "numbro";
import { fiatCurrencyMap } from "../../consts";

export const getFormattedUSDPriceFromCoin = ({ val, price, options }: Omit<GetPriceProps, "currency">) => {
  const value = getFiatPriceFromCoin({ val, price });
  return getFormattedFiatCurrencyValue({
    val: value,
    locale: localeMap.USD,
    formatOptions: {
      ...options?.formatOptions,
      currencySymbol: fiatCurrencyMap.USD,
    },
    capAtTrillion: options?.capAtTrillion,
  });
};

export const getFormattedEURPriceFromCoin = ({ val, price, options }: Omit<GetPriceProps, "currency">) => {
  const value = getFiatPriceFromCoin({ val, price });
  return getFormattedFiatCurrencyValue({
    val: value,
    locale: localeMap.EUR,
    formatOptions: {
      ...options?.formatOptions,
      currencySymbol: fiatCurrencyMap.EUR,
    },
    capAtTrillion: options?.capAtTrillion,
  });
};

export const getFormattedFiatPriceFromCoinValue = ({ val, price, currency, options }: GetPriceProps) => {
  const value = getFiatPriceFromCoin({ val, price });
  return getFormattedFiatCurrencyValue({
    val: value,
    locale: localeMap[currency],
    formatOptions: options?.formatOptions,
    capAtTrillion: options?.capAtTrillion,
  });
};
export const getFormattedFiatCurrencyValue = ({
  val,
  locale,
  formatOptions,
  capAtTrillion = true,
}: CurrencyPriceProps) => {
  numbro.setLanguage(locale || "en-US");

  if (capAtTrillion && val >= 1e12) {
    return `>${formatOptions?.currencySymbol || "$"}1.0T`;
  }

  return numbro(val)
    .formatCurrency({
      average: true,
      currencySymbol: "$",
      mantissa: 2,
      ...formatOptions,
    })
    .toUpperCase();
};

export const getFiatPriceFromCoin = ({ val, price }: Omit<GetPriceProps, "options" | "currency">) => {
  const value = new BigNumber(val).multipliedBy(price).toNumber();
  return value;
};

export const getCoinValueFromFiatPrice = ({ val, price }: Omit<GetPriceProps, "options" | "currency">) => {
  const value = new BigNumber(val).dividedBy(price).toNumber();
  return value;
};

export const getFormattedCoinValue = ({
  val,
  formatOptions,
  capAtTrillion = true,
  capAtTwoDecimals,
}: TokenNumberProps) => {
  if (capAtTwoDecimals && val < 0.01) {
    return "<0.01";
  }
  if (capAtTrillion && val >= 1e12) {
    return `>1.0T ${formatOptions?.currencySymbol || ""}`;
  }

  return numbro(val)
    .format({
      thousandSeparated: true,
      mantissa: 2,
      currencySymbol: "",
      ...formatOptions,
    })
    .toUpperCase();
};

const localeMap: Record<FiatCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
};

type GetPriceProps = {
  val: number | string;
  price: number;
  currency: FiatCurrency;
  options?: Omit<CurrencyPriceProps, "val" | "locale">;
};
type CurrencyPriceProps = {
  val: number;
  locale?: string;
  formatOptions?: numbro.Format;
  capAtTrillion?: boolean;
};
type TokenNumberProps = {
  val: number;
  formatOptions?: numbro.Format;
  capAtTrillion?: boolean;
  capAtTwoDecimals?: boolean;
};
