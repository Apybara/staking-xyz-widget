"use client";
import type { Currency } from "../../types";
import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { getFormattedCoinPrice, getFormattedTokenValue, getCurrencyValue } from "../../_utils/conversions";
import { RootAmountInputPad } from "./RootAmountInputPad";
import * as AvailabilityText from "./AvailabilityText";
import { useInputStates } from "./hooks";

export type AmountInputPadProps = {
  type: "stake" | "unstake";
  availableValue?: string;
  onDenomValueChange: (value: string) => void;
};

export const AmountInputPad = ({ type, availableValue, onDenomValueChange }: AmountInputPadProps) => {
  const [inputSize, setInputSize] = useState(1);
  const { primaryValue, secondaryValue, primaryCurrency, secondaryCurrency, setPrimaryValue, onSwap, onMax } =
    useInputStates();

  useEffect(() => {
    setInputSize(primaryValue === "" ? 1 : primaryValue.length);
  }, [primaryValue]);

  useEffect(() => {
    if (primaryValue === "") {
      onDenomValueChange("");
      return;
    }

    if (primaryCurrency !== "USD" && primaryCurrency !== "EUR") {
      onDenomValueChange(primaryValue);
      return;
    }
    if (secondaryCurrency !== "USD" && secondaryCurrency !== "EUR") {
      onDenomValueChange(secondaryValue);
      return;
    }
  }, [primaryValue, secondaryValue, primaryCurrency, secondaryCurrency]);

  const formattedSecondaryValue = useMemo(() => {
    if (secondaryValue === "0") return "0";

    if (secondaryCurrency === "USD" || secondaryCurrency === "EUR") {
      return getCurrencyValue({
        val: BigNumber(secondaryValue).toNumber(),
        locale: secondaryCurrency === "USD" ? "en-US" : "de-DE",
        formatOptions: {
          currencySymbol: secondaryCurrency === "USD" ? "$" : "€",
        },
      });
    }
    return getFormattedTokenValue({
      val: BigNumber(secondaryValue).toNumber(),
      formatOptions: {
        average: true,
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
      inputField={{
        value: primaryValue,
        currency: primaryCurrency || "USD",
        maxLength: primaryCurrency === "USD" || primaryCurrency === "EUR" ? 6 : 79,
        size: inputSize,
        onChange: (e) => {
          if (e.target.value === "") {
            setPrimaryValue("");
            return;
          }
          setPrimaryValue(e.target.value);
        },
      }}
      currencyConversionTool={{
        value: formattedSecondaryValue,
        currency: secondaryCurrency,
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

    if (primaryCurrency === "USD" || primaryCurrency === "EUR") {
      return getFormattedCoinPrice({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.[primaryCurrency] || 0,
        currency: primaryCurrency,
        options: {
          formatOptions: {
            currencySymbol: primaryCurrency === "USD" ? "$" : "€",
          },
        },
      });
    }
    return getFormattedTokenValue({ val: BigNumber(availableValue).toNumber() });
  }, [availableValue, primaryCurrency]);

  const secondaryValue = useMemo(() => {
    if (!availableValue) return "0";

    if (secondaryCurrency === "USD" || secondaryCurrency === "EUR") {
      return getFormattedCoinPrice({
        val: availableValue,
        price: coinPrice?.[network || "celestia"]?.[secondaryCurrency] || 0,
        currency: secondaryCurrency,
        options: {
          formatOptions: {
            currencySymbol: primaryCurrency === "USD" ? "$" : "€",
          },
        },
      });
    }
    return getFormattedTokenValue({ val: BigNumber(availableValue).toNumber() });
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
