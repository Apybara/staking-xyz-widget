import type { Currency } from "../../types";
import { useEffect, useState } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { networkCurrency as networkCurrencyMap, defaultNetwork, defaultGlobalCurrency } from "../../consts";
import {
  getNewPrimaryValueByCurrency,
  getNewSecondaryValueByCurrency,
  getNewSecondaryValueByPrimaryValue,
  getFormattedFiatValueFromCoin,
  getMaxCoinValueFromCoin,
} from "./utils";

export const useInputStates = () => {
  const { currency: globalCurrency, network, coinPrice } = useShell();
  const networkCurrency = networkCurrencyMap[network || defaultNetwork];

  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>(globalCurrency || defaultGlobalCurrency);
  const [secondaryCurrency, setSecondaryCurrency] = useState<Currency>(
    globalCurrency === "USD" || globalCurrency === "EUR" ? networkCurrency : "USD",
  );
  const [previousPrimaryCurrency, setPreviousPrimaryCurrency] = useState<Currency | undefined>();

  const [primaryValue, setPrimaryValue] = useState("");
  const [previousPrimaryValue, setPreviousPrimaryValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("0");

  const { onUpdateRouter: onUpdateCurrency } = useCurrencyChange();

  // Transition state on global currency and network currency change
  useEffect(() => {
    switch (primaryCurrency) {
      case "USD":
        if (globalCurrency === "USD") {
          setSecondaryCurrency(networkCurrency);
          break;
        }
        setPreviousPrimaryCurrency("USD");

        if (globalCurrency === "EUR") {
          setPrimaryCurrency("EUR");
          break;
        }

        setPrimaryCurrency(networkCurrency);
        setSecondaryCurrency("USD");
        break;
      case "EUR":
        if (globalCurrency === "EUR") {
          setSecondaryCurrency(networkCurrency);
          break;
        }
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
  }, [globalCurrency, networkCurrency]);

  // Update primary values on currency change
  useEffect(() => {
    setPreviousPrimaryValue(primaryValue);

    if (primaryValue === "" || primaryValue === "0") {
      setPrimaryValue("");
      return;
    }

    const usdPrice = coinPrice?.[network || defaultNetwork].USD || 0;
    const eurPrice = coinPrice?.[network || defaultNetwork].EUR || 0;
    const newPrimaryValue = getNewPrimaryValueByCurrency({
      primaryCurrency,
      previousPrimaryCurrency: previousPrimaryCurrency || primaryCurrency,
      primaryValue,
      secondaryValue,
      usdPrice,
      eurPrice,
    });

    if (newPrimaryValue) setPrimaryValue(newPrimaryValue);
  }, [primaryCurrency]);

  // Update secondary value on currency change
  useEffect(() => {
    if (primaryValue === "" || primaryValue === "0") {
      setSecondaryValue("0");
      return;
    }

    const usdPrice = coinPrice?.[network || defaultNetwork].USD || 0;
    const eurPrice = coinPrice?.[network || defaultNetwork].EUR || 0;
    const newSecondaryValue = getNewSecondaryValueByCurrency({
      primaryCurrency,
      secondaryCurrency,
      previousPrimaryCurrency: previousPrimaryCurrency || primaryCurrency,
      previousPrimaryValue,
      primaryValue,
      networkCurrency,
      usdPrice,
      eurPrice,
    });

    if (newSecondaryValue) setSecondaryValue(newSecondaryValue);
  }, [primaryCurrency]);

  // Update secondary value on primary value change
  useEffect(() => {
    if (primaryValue === "" || primaryValue === "0") {
      setSecondaryValue("0");
      return;
    }

    const usdPrice = coinPrice?.[network || defaultNetwork].USD || 0;
    const eurPrice = coinPrice?.[network || defaultNetwork].EUR || 0;
    const newSecondaryValue = getNewSecondaryValueByPrimaryValue({
      primaryCurrency,
      secondaryCurrency,
      primaryValue,
      usdPrice,
      eurPrice,
    });

    if (newSecondaryValue) setSecondaryValue(newSecondaryValue);
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
        const newMaxValue = getFormattedFiatValueFromCoin({
          coinValue: maxVal,
          targetFiatPrice: coinPrice?.[network || defaultNetwork].USD || 0,
        });
        setPrimaryValue(newMaxValue);
        setSecondaryValue(maxVal);
        return;
      }
      if (primaryCurrency === "EUR") {
        const newMaxValue = getFormattedFiatValueFromCoin({
          coinValue: maxVal,
          targetFiatPrice: coinPrice?.[network || defaultNetwork].EUR || 0,
        });
        setPrimaryValue(newMaxValue);
        setSecondaryValue(maxVal);
        return;
      }
      const newMaxValue = getMaxCoinValueFromCoin({ maxValue: maxVal });
      setPrimaryValue(newMaxValue);
    },
  };
};
