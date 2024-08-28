"use client";
import type { Currency } from "../../types";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import {
  getFormattedCoinValue,
  getDynamicAssetValueFromCoin,
  getFormattedFiatCurrencyValue,
} from "../../_utils/conversions";
import { getFormattedMantissa } from "../../_utils/number";
import { removeLeadingAndTrailingZeros } from "../../_utils";
import {
  defaultNetwork,
  fiatCurrencyMap,
  networkCurrency as networkCurrencyMap,
  requiredBalanceStakingByNetwork,
} from "../../consts";
import { RootAmountInputPad } from "./RootAmountInputPad";
import * as AvailabilityText from "./AvailabilityText";
import { getStringHasNumbersOnly } from "./InputField";
import Tooltip from "../Tooltip";
import { Icon } from "../Icon";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";

import * as S from "./amountInputPad.css";

export type BaseAmountInputPadProps = {
  primaryValue: string;
  secondaryValue: string;
  primaryCurrency: Currency;
  secondaryCurrency: Currency;
  setPrimaryValue: (val: string) => void;
  onSwap: () => void;
  maxAmountBuffer?: string;
  onMax: (maxVal?: string | undefined) => void;
  error?: ReactNode;
};

export type AmountInputPadProps = BaseAmountInputPadProps & {
  type: "stake" | "unstake";
  availableValue?: string;
  isAvailableValueLoading?: boolean;
  onValueChange: (value: string) => void;
  hideCurrencyConversion?: boolean;
  validatorInfo?: {
    isLoading: boolean;
    name: string;
    logo: string;
    address: string;
  };
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
  maxAmountBuffer,
  onMax,
  error,
  hideCurrencyConversion,
  validatorInfo,
}: AmountInputPadProps) => {
  const { network } = useShell();
  const castedNetwork = network || defaultNetwork;
  const networkCurrency = networkCurrencyMap[castedNetwork];
  const isAleo = getIsAleoNetwork(network);

  const requiredBalance = requiredBalanceStakingByNetwork[castedNetwork];

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
    const mantissa = getFormattedMantissa({ val: secondaryValue, maxMantissa: 2 });

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
        currencySymbol: secondaryCurrency,
      },
    });
  }, [secondaryValue, secondaryCurrency]);

  return (
    <RootAmountInputPad
      type={type}
      availableValue={availableValue}
      availabilityElement={
        <AvailabilityElement
          type={type}
          availableValue={availableValue}
          primaryCurrency={primaryCurrency}
          tooltip={
            type === "unstake" &&
            !isAleo && (
              <Tooltip
                className={S.topBarTooltip}
                trigger={<Icon name="info" />}
                content="You can only unstake positions that have been staked through Staking.xyz."
              />
            )
          }
        />
      }
      isAvailableValueLoading={isAvailableValueLoading}
      inputField={{
        value: primaryValue,
        currency: primaryCurrency || "USD",
        maxLength: primaryCurrency === "USD" || primaryCurrency === "EUR" ? 12 : 79,
        onChange: (e) => {
          if (e.target.value === "") {
            setPrimaryValue("");
            return;
          }
          if (!getStringHasNumbersOnly(e.target.value)) return;

          setPrimaryValue(e.target.value);
        },
        onBlur: () => {
          setPrimaryValue(removeLeadingAndTrailingZeros(primaryValue));
        },
      }}
      currencyConversionTool={{
        value: formattedSecondaryValue,
        onConvert: onSwap,
      }}
      onClickMax={() => {
        if (!availableValue) return;
        onMax(
          BigNumber(availableValue)
            .minus(maxAmountBuffer || "0")
            .toString(),
        );
      }}
      maxTooltip={
        type === "stake" ? (
          <Tooltip
            className={S.topBarTooltip}
            trigger={<Icon name="info" />}
            content={`${requiredBalance} ${networkCurrency} will be kept as a buffer on your balance to pay for future stake and unstake transactions.`}
          />
        ) : null
      }
      isMaxDisabled={type === "stake" && BigNumber(availableValue || "0").isLessThanOrEqualTo(requiredBalance)}
      error={error}
      hideCurrencyConversion={hideCurrencyConversion}
      validatorInfo={validatorInfo}
    />
  );
};

const AvailabilityElement = ({
  primaryCurrency,
  availableValue,
  type,
  tooltip,
}: { primaryCurrency: Currency; tooltip?: ReactNode } & Pick<AmountInputPadProps, "availableValue" | "type">) => {
  const { network, coinPrice, stakingType } = useShell();

  const prefix = type === "stake" ? "Available" : "Staked";

  const primaryValue = getDynamicAssetValueFromCoin({
    stakingType,
    network,
    coinVal: availableValue,
    coinPrice,
    currency: primaryCurrency,
  });

  if (!availableValue?.length) return null;

  return (
    <div className={S.topBarInfo}>
      <p style={{ lineHeight: 0 }}>
        <AvailabilityText.Primary>
          {prefix}: {primaryValue}
        </AvailabilityText.Primary>
      </p>
      {!!tooltip && tooltip}
    </div>
  );
};
