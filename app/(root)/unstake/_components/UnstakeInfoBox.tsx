"use client";
import type { Currency, CoinPrice, Network } from "../../../types";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import * as AccordionInfoCard from "../../../_components/AccordionInfoCard";
import {
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getFormattedCoinValue,
} from "../../../_utils/conversions";
import * as S from "./unstake.css";

export const UnstakeInfoBox = () => {
  const { unbondingDelegations } = useUnstaking();
  const { currency, coinPrice, network } = useShell();
  const count = unbondingDelegations?.data?.length;

  const totalUnbondingAmount = useMemo(() => {
    if (!count) return undefined;

    const sumDenom =
      unbondingDelegations?.data
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    return getFormattedCurrency({ currency, coinPrice, network, amount: sumDenom });
  }, [count, currency]);

  if (!count) return null;

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger>
          <div className={cn(S.triggerTexts)}>
            <p className={cn(S.triggerProgressText)}>
              In progress <span className={cn(S.triggerCountText)}>{count}</span>
            </p>
            <span className={cn(S.triggerAmountText)}>{totalUnbondingAmount}</span>
          </div>
        </AccordionInfoCard.Trigger>
        <AccordionInfoCard.Content>
          <AccordionInfoCard.Stack>
            {unbondingDelegations.data?.map((item, index) => {
              return (
                <AccordionInfoCard.StackItem key={"unbonding-delegations" + network + index}>
                  <InfoCard.TitleBox>
                    <p className={cn(S.remainingDays)}>{item.remainingDays} days left</p>
                  </InfoCard.TitleBox>
                  <InfoCard.Content>
                    {getFormattedCurrency({ currency, coinPrice, network, amount: item.amount })}
                  </InfoCard.Content>
                </AccordionInfoCard.StackItem>
              );
            })}
          </AccordionInfoCard.Stack>
        </AccordionInfoCard.Content>
      </AccordionInfoCard.Item>
    </AccordionInfoCard.Root>
  );
};

const getFormattedCurrency = ({
  currency,
  coinPrice,
  network,
  amount,
}: {
  currency: Currency | null;
  coinPrice: CoinPrice | null;
  network: Network | null;
  amount: string;
}) => {
  const castedCurrency = currency || "USD";

  if (castedCurrency === "USD") {
    return getFormattedUSDPriceFromCoin({
      val: amount,
      price: coinPrice?.[network || "celestia"]?.USD || 0,
    });
  }
  if (castedCurrency === "EUR") {
    return getFormattedEURPriceFromCoin({
      val: amount,
      price: coinPrice?.[network || "celestia"]?.EUR || 0,
    });
  }
  return getFormattedCoinValue({ val: BigNumber(amount).toNumber() });
};
