import type { FiatCurrency, CoinPrice, Currency, Network, StakingType } from "../../types";
import BigNumber from "bignumber.js";
import numbro from "numbro";
import { fiatCurrencyMap, networkCurrency, defaultGlobalCurrency, defaultNetwork } from "../../consts";

const numbroDefaultOptions: numbro.Format = {
  mantissa: 2,
};
numbroDefaultOptions.roundingFunction = Math.floor;

export const getDynamicAssetValueFromCoin = ({
  stakingType,
  network,
  coinVal,
  coinPrice,
  currency,
  minValue,
  formatOptions,
}: GetDynamicAssetValueFromCoinProps) => {
  const castedCurrency = currency || defaultGlobalCurrency;

  if (!coinVal && coinVal !== 0) return undefined;

  if (castedCurrency === "USD") {
    return getFormattedUSDPriceFromCoin({
      val: coinVal,
      price: coinPrice?.[network || defaultNetwork]?.USD || 0,
      options: { minValue, formatOptions },
    });
  }

  if (castedCurrency === "EUR") {
    return getFormattedEURPriceFromCoin({
      val: coinVal,
      price: coinPrice?.[network || defaultNetwork]?.EUR || 0,
      options: { minValue, formatOptions },
    });
  }

  return getFormattedCoinValue({
    val: BigNumber(coinVal).toNumber(),
    formatOptions: {
      ...formatOptions,
      currencySymbol: networkCurrency[network || defaultNetwork],
    },
    minValue,
  });
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
    minValue: options?.minValue,
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
    minValue: options?.minValue,
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
  minValue = 0.01,
}: CurrencyPriceProps) => {
  numbro.setLanguage(locale || "en-US");

  const bigNumVal = BigNumber(val);
  const defaultSymbol = formatOptions?.currencySymbol || "$";

  if ((formatOptions?.mantissa || 2) >= 2 && bigNumVal.isGreaterThan(0) && bigNumVal.isLessThan(minValue)) {
    return `<${defaultSymbol}${minValue}`;
  }
  if (capAtTrillion && val >= 1e12) {
    return `>${defaultSymbol}1.0T`;
  }

  const mantissa = formatOptions?.mantissa || (val === 0 ? 0 : numbroDefaultOptions.mantissa);
  return numbro(val)
    .formatCurrency({
      ...numbroDefaultOptions,
      average: true,
      currencySymbol: "$",
      ...formatOptions,
      mantissa,
    })
    .toUpperCase();
};

export const getFiatPriceFromCoin = ({ val, price }: Omit<GetPriceProps, "options" | "currency">) => {
  const value = Number(new BigNumber(val).multipliedBy(price).toNumber().toPrecision(6));
  return value;
};

export const getCoinValueFromFiatPrice = ({ val, price }: Omit<GetPriceProps, "options" | "currency">) => {
  const value = Number(new BigNumber(val).dividedBy(price).toNumber().toPrecision(6));
  return value;
};

export const getFormattedCoinValue = ({
  val,
  formatOptions,
  capAtTrillion = true,
  minValue = 0.01,
}: TokenNumberProps) => {
  const bigNumVal = BigNumber(val);
  const defaultSymbol = formatOptions?.currencySymbol ? `${" "}${formatOptions?.currencySymbol}` : "";

  if ((formatOptions?.mantissa || 2) >= 2 && bigNumVal.isGreaterThan(0) && bigNumVal.isLessThan(minValue)) {
    return `<${minValue}${defaultSymbol}`;
  }
  if (capAtTrillion && val >= 1e12) {
    return `>1.0T${defaultSymbol}`;
  }

  const mantissa = formatOptions?.mantissa || (val === 0 ? 0 : numbroDefaultOptions.mantissa);
  const value = numbro(val)
    .format({
      ...numbroDefaultOptions,
      average: true,
      ...formatOptions,
      mantissa,
    })
    .toUpperCase();

  return `${value}${defaultSymbol}`;
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
  minValue?: number;
};
type TokenNumberProps = {
  val: number;
  formatOptions?: numbro.Format;
  capAtTrillion?: boolean;
  capAtTwoDecimals?: boolean;
  minValue?: number;
};
type GetDynamicAssetValueFromCoinProps = {
  stakingType?: StakingType | null;
  network: Network | null;
  coinVal?: string | number;
  coinPrice: CoinPrice | null;
  currency: Currency | null;
  minValue?: number;
  formatOptions?: numbro.Format;
};
