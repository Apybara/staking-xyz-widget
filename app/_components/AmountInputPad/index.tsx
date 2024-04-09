"use client";
import type { Currency } from "../../types";
import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import {
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getFormattedCoinValue,
  getFormattedFiatCurrencyValue,
} from "../../_utils/conversions";
import { fiatCurrencyMap } from "../../consts";
import { RootAmountInputPad } from "./RootAmountInputPad";
import * as AvailabilityText from "./AvailabilityText";
import { getStringHasNumbersOnly } from "./InputField";

export type BaseAmountInputPadProps = {
  primaryValue: string;
  secondaryValue: string;
  primaryCurrency: Currency;
  secondaryCurrency: Currency;
  setPrimaryValue: (val: string) => void;
  onSwap: () => void;
  onMax: (maxVal?: string | undefined) => void;
};

export type AmountInputPadProps = BaseAmountInputPadProps & {
  type: "stake" | "unstake";
  availableValue?: string;
  isAvailableValueLoading?: boolean;
  onValueChange: (value: string) => void;
};

export const AmountInputPad = ({
  type,
  availableValue,
  isAvailableValueLoading,
  onValueChange,
  primaryValue,
  secondaryValue,
  primaryCurrency,
  secondaryCurrency,
  setPrimaryValue,
  onSwap,
  onMax,
}: AmountInputPadProps) => {
  const [inputSize, setInputSize] = useState(1);

  useEffect(() => {
    setInputSize(primaryValue === "" ? 1 : primaryValue.length);
  }, [primaryValue]);

  useEffect(() => {
    if (primaryValue === "") {
      onValueChange("");
      return;
    }

    if (primaryCurrency !== "USD" && primaryCurrency !== "EUR") {
      onValueChange(primaryValue);
      return;
    }
    if (secondaryCurrency !== "USD" && secondaryCurrency !== "EUR") {
      onValueChange(secondaryValue);
      return;
    }
  }, [primaryValue, secondaryValue, primaryCurrency, secondaryCurrency]);

  const formattedSecondaryValue = useMemo(() => {
    const mantissa = secondaryValue === "0" ? 0 : 2;

    if (secondaryCurrency === "USD" || secondaryCurrency === "EUR") {
      return getFormattedFiatCurrencyValue({
        val: BigNumber(secondaryValue).toNumber(),
        locale: secondaryCurrency === "USD" ? "en-US" : "de-DE",
        formatOptions: {
          currencySymbol: fiatCurrencyMap[secondaryCurrency],
          mantissa,
        },
      });
    }
    return getFormattedCoinValue({
      val: BigNumber(secondaryValue).toNumber(),
      formatOptions: {
        average: true,
        mantissa,
      },
    });
  }, [secondaryValue, secondaryCurrency]);

  return (
    <RootAmountInputPad
      availableValue={availableValue}
      availabilityElement={
        <AvailabilityElement
          type={type}
          availableValue={availableValue}
          primaryCurrency={primaryCurrency}
          secondaryCurrency={secondaryCurrency}
        />
      }
      isAvailableValueLoading={isAvailableValueLoading}
      inputField={{
        value: primaryValue,
        currency: primaryCurrency || "USD",
        maxLength: primaryCurrency === "USD" || primaryCurrency === "EUR" ? 12 : 79,
        size: inputSize,
        onChange: (e) => {
          if (e.target.value === "") {
            setPrimaryValue("");
            return;
          }
          if (!getStringHasNumbersOnly(e.target.value)) return;

          setPrimaryValue(e.target.value);
        },
      }}
      currencyConversionTool={{
        value: formattedSecondaryValue,
        onConvert: onSwap,
      }}
      onClickMax={() => {
        onMax(availableValue);
      }}
    />
  );
};

const AvailabilityElement = ({
  primaryCurrency,
  secondaryCurrency,
  availableValue,
  type,
}: { primaryCurrency: Currency; secondaryCurrency: Currency } & Pick<
  AmountInputPadProps,
  "availableValue" | "type"
>) => {
  const { network, coinPrice } = useShell();

  const prefix = type === "stake" ? "Available" : "Staked";

  const primaryValue = useMemo(() => {
    if (!availableValue) return "0";

    if (primaryCurrency === "USD") {
      return getFormattedUSDPriceFromCoin({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.USD || 0,
      });
    }
    if (primaryCurrency === "EUR") {
      return getFormattedEURPriceFromCoin({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.EUR || 0,
      });
    }
    return getFormattedCoinValue({ val: BigNumber(availableValue).toNumber() });
  }, [availableValue, primaryCurrency]);

  const secondaryValue = useMemo(() => {
    if (!availableValue) return "0";

    if (secondaryCurrency === "USD") {
      return getFormattedUSDPriceFromCoin({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.USD || 0,
      });
    }
    if (secondaryCurrency === "EUR") {
      return getFormattedEURPriceFromCoin({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.EUR || 0,
      });
    }

    return getFormattedCoinValue({ val: BigNumber(availableValue).toNumber() });
  }, [availableValue, secondaryCurrency]);

  if (!availableValue?.length) return null;

  return (
    <p style={{ lineHeight: 0 }}>
      <AvailabilityText.Primary>
        {prefix}: {primaryValue}
      </AvailabilityText.Primary>{" "}
      <AvailabilityText.Secondary>
        ({secondaryValue}
        {secondaryCurrency !== "USD" && secondaryCurrency !== "EUR" ? ` ${secondaryCurrency}` : ""})
      </AvailabilityText.Secondary>
    </p>
  );
};
