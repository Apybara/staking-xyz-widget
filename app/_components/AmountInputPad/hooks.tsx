import type { Currency } from "../../types";
import { useEffect, useState } from "react";
import numbro from "numbro";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { getCoinValueFromFiatPrice, getFiatPriceFromCoin } from "../../_utils/conversions";
import { networkCurrency as networkCurrencyMap } from "../../consts";

export const useInputStates = () => {
  const { currency: globalCurrency, network, coinPrice } = useShell();
  const networkCurrency = networkCurrencyMap[network || "celestia"];

  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>(globalCurrency || "USD");
  const [secondaryCurrency, setSecondaryCurrency] = useState<Currency>(
    globalCurrency === "USD" || globalCurrency === "EUR" ? networkCurrency : "USD",
  );
  const [previousPrimaryCurrency, setPreviousPrimaryCurrency] = useState<Currency | undefined>();

  const [primaryValue, setPrimaryValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("0");

  const { onUpdateRouter: onUpdateCurrency } = useCurrencyChange();

  // Transition state on global currency change
  useEffect(() => {
    switch (primaryCurrency) {
      case "USD":
        if (globalCurrency === "USD") break;
        setPreviousPrimaryCurrency("USD");

        if (globalCurrency === "EUR") {
          setPrimaryCurrency("EUR");
          break;
        }

        setPrimaryCurrency(networkCurrency);
        setSecondaryCurrency("USD");
        break;
      case "EUR":
        if (globalCurrency === "EUR") break;
        setPreviousPrimaryCurrency("EUR");

        if (globalCurrency === "USD") {
          setPrimaryCurrency("USD");
          break;
        }

        setPrimaryCurrency(networkCurrency);
        setSecondaryCurrency("EUR");
        break;
      default:
        if (globalCurrency === networkCurrency) break;
        setPreviousPrimaryCurrency(networkCurrency);

        if (globalCurrency === "USD") {
          setPrimaryCurrency("USD");
          setSecondaryCurrency(networkCurrency);
          break;
        }
        if (globalCurrency === "EUR") {
          setPrimaryCurrency("EUR");
          setSecondaryCurrency(networkCurrency);
          break;
        }
    }
  }, [globalCurrency]);

  // Update primary values on state change
  useEffect(() => {
    if (primaryValue === "" || primaryValue === "0") {
      setPrimaryValue("");
      return;
    }

    const usdPrice = coinPrice?.[network || "celestia"].USD || 0;
    const eurPrice = coinPrice?.[network || "celestia"].EUR || 0;

    switch (primaryCurrency) {
      case "USD":
        if (previousPrimaryCurrency === "EUR") {
          const newPrimaryValue = getPrimaryFiatValueFromSecondaryCoin({
            secondaryCoin: secondaryValue,
            targetFiatPrice: usdPrice,
          });
          setPrimaryValue(newPrimaryValue);
          break;
        } else {
          const newPrimaryValue = getPrimaryFiatValueFromPrimaryCoin({
            primaryCoin: primaryValue,
            targetFiatPrice: usdPrice,
          });
          setPrimaryValue(newPrimaryValue);
          break;
        }
      case "EUR":
        if (previousPrimaryCurrency === "USD") {
          const newPrimaryValue = getPrimaryFiatValueFromSecondaryCoin({
            secondaryCoin: secondaryValue,
            targetFiatPrice: eurPrice,
          });
          setPrimaryValue(newPrimaryValue);
          break;
        } else {
          const newPrimaryValue = getPrimaryFiatValueFromPrimaryCoin({
            primaryCoin: primaryValue,
            targetFiatPrice: eurPrice,
          });
          setPrimaryValue(newPrimaryValue);
          break;
        }
      default:
        if (previousPrimaryCurrency === "USD" || previousPrimaryCurrency === "EUR") {
          const newPrimaryValue = getPrimaryCoinValueFromSecondaryCoin({ secondaryCoinValue: secondaryValue });
          setPrimaryValue(newPrimaryValue);
        }
    }
  }, [primaryCurrency, previousPrimaryCurrency]);

  // Update secondary value on primary value change
  useEffect(() => {
    if (primaryValue === "" || primaryValue === "0") {
      setSecondaryValue("0");
      return;
    }

    const usdPrice = coinPrice?.[network || "celestia"].USD || 0;
    const eurPrice = coinPrice?.[network || "celestia"].EUR || 0;

    if (primaryCurrency === "USD") {
      const newSecondaryValue = getSecondaryCoinValueFromPrimaryFiat({ fiatValue: primaryValue, fiatPrice: usdPrice });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === networkCurrency && secondaryCurrency === "USD") {
      const newSecondaryValue = getSecondaryFiatValueFromPrimaryCoin({
        coinValue: primaryValue,
        fiatPrice: usdPrice,
      });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === "EUR") {
      const newSecondaryValue = getSecondaryCoinValueFromPrimaryFiat({ fiatValue: primaryValue, fiatPrice: eurPrice });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === networkCurrency && secondaryCurrency === "EUR") {
      const newSecondaryValue = getSecondaryFiatValueFromPrimaryCoin({
        coinValue: primaryValue,
        fiatPrice: eurPrice,
      });
      setSecondaryValue(newSecondaryValue);
      return;
    }
  }, [primaryValue]);

  return {
    primaryValue,
    secondaryValue,
    primaryCurrency: primaryCurrency,
    secondaryCurrency: secondaryCurrency,
    setPrimaryValue,
    onSwap: () => {
      onUpdateCurrency(secondaryCurrency);
    },
    onMax: (maxVal?: string) => {
      if (!maxVal) return;

      if (primaryCurrency === "USD") {
        const newMaxValue = getMaxFiatValueFromCoin({
          maxValue: maxVal,
          fiatPrice: coinPrice?.[network || "celestia"].USD || 0,
        });
        setPrimaryValue(newMaxValue);
        return;
      }
      if (primaryCurrency === "EUR") {
        const newMaxValue = getMaxFiatValueFromCoin({
          maxValue: maxVal,
          fiatPrice: coinPrice?.[network || "celestia"].EUR || 0,
        });
        setPrimaryValue(newMaxValue);
        return;
      }
      const newMaxValue = getMaxCoinValueFromCoin({ maxValue: maxVal });
      setPrimaryValue(newMaxValue);
    },
  };
};

const getPrimaryFiatValueFromSecondaryCoin = ({
  secondaryCoin,
  targetFiatPrice,
}: {
  secondaryCoin: string;
  targetFiatPrice: number;
}) => {
  const newValue = getFiatPriceFromCoin({
    val: secondaryCoin,
    price: targetFiatPrice,
  });
  return numbro(newValue).format({
    mantissa: 2,
  });
};

const getPrimaryFiatValueFromPrimaryCoin = ({
  primaryCoin,
  targetFiatPrice,
}: {
  primaryCoin: string;
  targetFiatPrice: number;
}) => {
  const newValue = getFiatPriceFromCoin({
    val: primaryCoin,
    price: targetFiatPrice,
  });
  return numbro(newValue).format({
    mantissa: 2,
  });
};

const getPrimaryCoinValueFromSecondaryCoin = ({ secondaryCoinValue }: { secondaryCoinValue: string }) => {
  return numbro(BigNumber(secondaryCoinValue).toNumber()).format({
    mantissa: 2,
  });
};
const getSecondaryCoinValueFromPrimaryFiat = ({ fiatValue, fiatPrice }: { fiatValue: string; fiatPrice: number }) => {
  return numbro(
    getCoinValueFromFiatPrice({
      val: fiatValue,
      price: fiatPrice,
    }),
  ).format({
    mantissa: 2,
  });
};
const getSecondaryFiatValueFromPrimaryCoin = ({ coinValue, fiatPrice }: { coinValue: string; fiatPrice: number }) => {
  return numbro(
    getFiatPriceFromCoin({
      val: coinValue,
      price: fiatPrice,
    }),
  ).format({
    mantissa: 2,
  });
};
const getMaxFiatValueFromCoin = ({ maxValue, fiatPrice }: { maxValue: string; fiatPrice: number }) => {
  const newMaxValue = getFiatPriceFromCoin({
    val: maxValue,
    price: fiatPrice,
  });
  return numbro(newMaxValue).format({
    mantissa: 2,
  });
};
const getMaxCoinValueFromCoin = ({ maxValue }: { maxValue: string }) => {
  return numbro(BigNumber(maxValue).toNumber()).format({
    mantissa: 2,
  });
};
