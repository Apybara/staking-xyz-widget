import type { FiatCurrency, CoinPrice, Currency, Network } from "../../types";
import BigNumber from "bignumber.js";
import numbro from "numbro";
import { fiatCurrencyMap } from "../../consts";

const numbroDefaultOptions: numbro.Format = {
  mantissa: 2,
};
numbroDefaultOptions.roundingFunction = Math.floor;

export const getDynamicAssetValueFromCoin = ({
  network,
  coinVal,
  coinPrice,
  currency,
}: {
  network: Network | null;
  coinVal?: string | number;
  coinPrice: CoinPrice | null;
  currency: Currency | null;
}) => {
  const castedCurrency = currency || "USD";

  if (!coinVal) return undefined;

  if (castedCurrency === "USD") {
    return getFormattedUSDPriceFromCoin({
      val: coinVal,
      price: coinPrice?.[network || "celestia"]?.USD || 0,
    });
  }

  if (castedCurrency === "EUR") {
    return getFormattedEURPriceFromCoin({
      val: coinVal,
      price: coinPrice?.[network || "celestia"]?.EUR || 0,
    });
  }

  return getFormattedCoinValue({ val: BigNumber(coinVal).toNumber() });
};

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

  const defaultSymbol = formatOptions?.currencySymbol || "$";
  if ((formatOptions?.mantissa || 2) <= 2 && val > 0 && val < 0.01) {
    return `<${defaultSymbol}0.01`;
  }
  if (capAtTrillion && val >= 1e12) {
    return `>${defaultSymbol}1.0T`;
  }

  return numbro(val)
    .formatCurrency({
      ...numbroDefaultOptions,
      average: true,
      currencySymbol: "$",
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

export const getFormattedCoinValue = ({ val, formatOptions, capAtTrillion = true }: TokenNumberProps) => {
  if ((formatOptions?.mantissa || 2) <= 2 && val > 0 && val < 0.01) {
    return "<0.01";
  }
  if (capAtTrillion && val >= 1e12) {
    return `>1.0T ${formatOptions?.currencySymbol || ""}`;
  }

  return numbro(val)
    .format({
      ...numbroDefaultOptions,
      average: true,
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
