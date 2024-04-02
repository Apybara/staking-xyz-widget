import type { Currency } from "../../types";
import { useEffect, useState } from "react";
import numbro from "numbro";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { getTokenValueFromFiat, getCoinPriceFromToken } from "../../_utils/conversions";
import { networkDenom } from "../../consts";

export const useInputStates = () => {
  const { currency: globalCurrency, network, coinPrice } = useShell();

  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>(globalCurrency || "USD");
  const [secondaryCurrency, setSecondaryCurrency] = useState<Currency>(
    globalCurrency === "USD" || globalCurrency === "EUR" ? networkDenom[network || "celestia"] : "USD",
  );
  const [previousPrimaryCurrency, setPreviousPrimaryCurrency] = useState<Currency | undefined>();

  const [primaryValue, setPrimaryValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("0");

  const { onUpdateRouter: onUpdateCurrency } = useCurrencyChange();
  const denom = networkDenom[network || "celestia"];

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

        setPrimaryCurrency(denom);
        setSecondaryCurrency("USD");
        break;
      case "EUR":
        if (globalCurrency === "EUR") break;
        setPreviousPrimaryCurrency("EUR");

        if (globalCurrency === "USD") {
          setPrimaryCurrency("USD");
          break;
        }

        setPrimaryCurrency(denom);
        setSecondaryCurrency("EUR");
        break;
      default:
        if (globalCurrency === denom) break;
        setPreviousPrimaryCurrency(denom);

        if (globalCurrency === "USD") {
          setPrimaryCurrency("USD");
          setSecondaryCurrency(denom);
          break;
        }
        if (globalCurrency === "EUR") {
          setPrimaryCurrency("EUR");
          setSecondaryCurrency(denom);
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
          const newPrimaryValue = getFiatValueFromFiat({ fromDenomValue: secondaryValue, targetFiatPrice: usdPrice });
          setPrimaryValue(newPrimaryValue);
          break;
        } else {
          const newPrimaryValue = getPrimaryFiatValueFromSecondaryFiat({ secondaryFiatValue: secondaryValue });
          setPrimaryValue(newPrimaryValue);
          break;
        }
      case "EUR":
        if (previousPrimaryCurrency === "USD") {
          const newPrimaryValue = getFiatValueFromFiat({ fromDenomValue: secondaryValue, targetFiatPrice: eurPrice });
          setPrimaryValue(newPrimaryValue);
          break;
        } else {
          const newPrimaryValue = getPrimaryFiatValueFromSecondaryFiat({ secondaryFiatValue: secondaryValue });
          setPrimaryValue(newPrimaryValue);
          break;
        }
      default:
        if (previousPrimaryCurrency === "USD" || previousPrimaryCurrency === "EUR") {
          const newPrimaryValue = getPrimaryDenomValueFromSecondaryDenom({ secondaryDenomValue: secondaryValue });
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
      const newSecondaryValue = getSecondaryDenomValueFromPrimaryFiat({ fiatValue: primaryValue, fiatPrice: usdPrice });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === denom && secondaryCurrency === "USD") {
      const newSecondaryValue = getSecondaryFiatValueFromPrimaryDenom({
        denomValue: primaryValue,
        fiatPrice: usdPrice,
      });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === "EUR") {
      const newSecondaryValue = getSecondaryDenomValueFromPrimaryFiat({ fiatValue: primaryValue, fiatPrice: eurPrice });
      setSecondaryValue(newSecondaryValue);
      return;
    }
    if (primaryCurrency === denom && secondaryCurrency === "EUR") {
      const newSecondaryValue = getSecondaryFiatValueFromPrimaryDenom({
        denomValue: primaryValue,
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
        const newMaxValue = getMaxFiatValueFromDenom({
          maxValue: maxVal,
          fiatPrice: coinPrice?.[network || "celestia"].USD || 0,
        });
        setPrimaryValue(newMaxValue);
        return;
      }
      if (primaryCurrency === "EUR") {
        const newMaxValue = getMaxFiatValueFromDenom({
          maxValue: maxVal,
          fiatPrice: coinPrice?.[network || "celestia"].EUR || 0,
        });
        setPrimaryValue(newMaxValue);
        return;
      }
      const newMaxValue = getMaxDenomValueFromDenom({ maxValue: maxVal });
      setPrimaryValue(newMaxValue);
    },
  };
};

const getFiatValueFromFiat = ({
  fromDenomValue,
  targetFiatPrice,
}: {
  fromDenomValue: string;
  targetFiatPrice: number;
}) => {
  const newValue = getCoinPriceFromToken({
    val: fromDenomValue,
    price: targetFiatPrice,
  });
  return numbro(newValue).format({
    average: true,
    mantissa: 4,
  });
};

const getPrimaryFiatValueFromSecondaryFiat = ({ secondaryFiatValue }: { secondaryFiatValue: string }) => {
  return numbro(BigNumber(secondaryFiatValue).toNumber()).format({
    average: true,
    mantissa: 2,
  });
};

const getPrimaryDenomValueFromSecondaryDenom = ({ secondaryDenomValue }: { secondaryDenomValue: string }) => {
  return numbro(BigNumber(secondaryDenomValue).toNumber()).format({
    average: true,
    mantissa: 6,
  });
};
const getSecondaryDenomValueFromPrimaryFiat = ({ fiatValue, fiatPrice }: { fiatValue: string; fiatPrice: number }) => {
  return getTokenValueFromFiat({
    val: fiatValue,
    price: fiatPrice,
  }).toString();
};
const getSecondaryFiatValueFromPrimaryDenom = ({
  denomValue,
  fiatPrice,
}: {
  denomValue: string;
  fiatPrice: number;
}) => {
  return getCoinPriceFromToken({
    val: denomValue,
    price: fiatPrice,
  }).toString();
};
const getMaxFiatValueFromDenom = ({ maxValue, fiatPrice }: { maxValue: string; fiatPrice: number }) => {
  const newMaxValue = getCoinPriceFromToken({
    val: maxValue,
    price: fiatPrice,
  });
  return numbro(newMaxValue).format({
    average: true,
    mantissa: 4,
  });
};
const getMaxDenomValueFromDenom = ({ maxValue }: { maxValue: string }) => {
  return numbro(BigNumber(maxValue).toNumber()).format({
    average: true,
    mantissa: 6,
  });
};
