import BigNumber from "bignumber.js";
import numbro from "numbro";
import { BaseCurrency } from "../../types";

export const getFormattedCoinPrice = ({ val, price, currency, options }: GetPriceProps) => {
  const value = new BigNumber(val).multipliedBy(price).toNumber();
  return getCurrencyValue({
    val: value,
    locale: localeMap[currency],
    formatOptions: options?.formatOptions,
    capAtTrillion: options?.capAtTrillion,
  });
};

const getCurrencyValue = ({ val, locale, formatOptions, capAtTrillion = true }: CurrencyPriceProps) => {
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

export const getFormattedTokenValue = ({
  val,
  formatOptions,
  capAtTrillion = true,
  capAtTwoDecimals,
}: TokenNumberProps) => {
  if (capAtTwoDecimals && val < 0.01) {
    return "<0.01";
  }
  if (capAtTrillion && val >= 1e12) {
    return `>1.0T ${formatOptions?.currencySymbol || "$"}`;
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

const localeMap: Record<BaseCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
};

type GetPriceProps = {
  val: number | string;
  price: number;
  currency: BaseCurrency;
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
