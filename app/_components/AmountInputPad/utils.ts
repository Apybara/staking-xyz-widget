import type { Currency } from "../../types";
import numbro from "numbro";
import { getFormattedMantissa } from "../../_utils/number";
import { getFiatPriceFromCoin, getCoinValueFromFiatPrice } from "../../_utils/conversions";

const numbroDefaultOptions: numbro.Format = {
  mantissa: 2,
};
numbroDefaultOptions.roundingFunction = Math.floor;

export const getNewPrimaryValueByCurrency = ({
  primaryCurrency,
  previousPrimaryCurrency,
  primaryValue,
  secondaryValue,
  usdPrice,
  eurPrice,
}: {
  primaryCurrency: Currency;
  previousPrimaryCurrency: Currency;
  primaryValue: string;
  secondaryValue: string;
  usdPrice: number;
  eurPrice: number;
}) => {
  switch (primaryCurrency) {
    case "USD":
      if (previousPrimaryCurrency === "EUR") {
        return getFormattedFiatValueFromCoin({
          coinValue: secondaryValue,
          targetFiatPrice: usdPrice,
        });
      } else {
        return getFormattedFiatValueFromCoin({
          coinValue: primaryValue,
          targetFiatPrice: usdPrice,
        });
      }
    case "EUR":
      if (previousPrimaryCurrency === "USD") {
        return getFormattedFiatValueFromCoin({
          coinValue: secondaryValue,
          targetFiatPrice: eurPrice,
        });
      } else {
        return getFormattedFiatValueFromCoin({
          coinValue: primaryValue,
          targetFiatPrice: eurPrice,
        });
      }
    default:
      if (previousPrimaryCurrency === "USD" || previousPrimaryCurrency === "EUR") {
        return getPrimaryCoinValueFromSecondaryCoin({ secondaryCoinValue: secondaryValue });
      }
  }
};

export const getNewSecondaryValueByCurrency = ({
  primaryCurrency,
  secondaryCurrency,
  previousPrimaryCurrency,
  previousPrimaryValue,
  primaryValue,
  networkCurrency,
  usdPrice,
  eurPrice,
}: {
  primaryCurrency: Currency;
  secondaryCurrency: Currency;
  previousPrimaryCurrency: Currency;
  previousPrimaryValue: string;
  primaryValue: string;
  networkCurrency: Currency;
  usdPrice: number;
  eurPrice: number;
}) => {
  if (primaryCurrency === "USD") {
    if (previousPrimaryCurrency === "EUR") return;

    if (previousPrimaryValue !== "") {
      return previousPrimaryValue;
    }

    return getCoinValueFromFiat({ fiatValue: primaryValue, fiatPrice: usdPrice });
  }
  if (primaryCurrency === networkCurrency && secondaryCurrency === "USD") {
    return getFormattedFiatValueFromCoin({
      coinValue: primaryValue,
      targetFiatPrice: usdPrice,
    });
  }
  if (primaryCurrency === "EUR") {
    if (previousPrimaryCurrency === "USD") return;

    if (previousPrimaryValue !== "") {
      return previousPrimaryValue;
    }

    return getCoinValueFromFiat({ fiatValue: primaryValue, fiatPrice: usdPrice });
  }
  if (primaryCurrency === networkCurrency && secondaryCurrency === "EUR") {
    return getFormattedFiatValueFromCoin({
      coinValue: primaryValue,
      targetFiatPrice: eurPrice,
    });
  }
};

export const getNewSecondaryValueByPrimaryValue = ({
  primaryValue,
  primaryCurrency,
  secondaryCurrency,
  usdPrice,
  eurPrice,
}: {
  primaryValue: string;
  primaryCurrency: Currency;
  secondaryCurrency: Currency;
  usdPrice: number;
  eurPrice: number;
}) => {
  if (primaryCurrency === "USD") {
    return getCoinValueFromFiat({ fiatValue: primaryValue, fiatPrice: usdPrice });
  }
  if (primaryCurrency === "EUR") {
    return getCoinValueFromFiat({ fiatValue: primaryValue, fiatPrice: eurPrice });
  }
  if (secondaryCurrency === "USD") {
    return getFormattedFiatValueFromCoin({
      coinValue: primaryValue,
      targetFiatPrice: usdPrice,
    });
  }
  if (secondaryCurrency === "EUR") {
    return getFormattedFiatValueFromCoin({
      coinValue: primaryValue,
      targetFiatPrice: eurPrice,
    });
  }
};

export const getFormattedFiatValueFromCoin = ({
  coinValue,
  targetFiatPrice,
}: {
  coinValue: string;
  targetFiatPrice: number;
}) => {
  const newValue = getFiatPriceFromCoin({
    val: coinValue,
    price: targetFiatPrice,
  });
  const mantissa = getFormattedMantissa({ val: newValue });
  return numbro(newValue).format({ ...numbroDefaultOptions, mantissa });
};

export const getCoinValueFromFiat = ({ fiatValue, fiatPrice }: { fiatValue: string; fiatPrice: number }) => {
  const newValue = getCoinValueFromFiatPrice({
    val: fiatValue,
    price: fiatPrice,
  });
  const mantissa = getFormattedMantissa({ val: newValue });
  return numbro(newValue).format({ ...numbroDefaultOptions, mantissa });
};

export const getPrimaryCoinValueFromSecondaryCoin = ({ secondaryCoinValue }: { secondaryCoinValue: string }) => {
  const mantissa = getFormattedMantissa({ val: secondaryCoinValue });
  return numbro(secondaryCoinValue).format({ ...numbroDefaultOptions, mantissa });
};

export const getMaxCoinValueFromCoin = ({ maxValue }: { maxValue: string }) => {
  return numbro(maxValue).format({ ...numbroDefaultOptions, mantissa: 6 });
};
