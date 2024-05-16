"use client";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import * as AccordionInfoCard from "../../../_components/AccordionInfoCard";
import { getTimeUnitStrings } from "../../../_utils/time";
import { getDynamicAssetValueFromCoin } from "../../../_utils/conversions";
import { useActivity } from "../../../_services/stakingOperator/hooks";
import * as S from "./unstake.css";

export const UnstakeInfoBox = () => {
  const { currency, coinPrice, network } = useShell();

  const { query: unstakeActivityTotalQuery } =
    useActivity({
      filterKey: "transactions_unstake",
      offset: 0,
      limit: 999,
    }) || {};
  const { totalEntries } = unstakeActivityTotalQuery || {};
  const { query: unstakeActivityQuery } =
    useActivity({
      filterKey: "transactions_unstake",
      offset: 0,
      limit: totalEntries || 999,
    }) || {};
  const { formattedEntries } = unstakeActivityQuery || {};
  const inProgressEntries = formattedEntries?.filter((item) => !!item.completionTime);

  const totalUnbondingAmount = useMemo(() => {
    if (!inProgressEntries?.length) return undefined;

    const sumDenom =
      inProgressEntries
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    return getDynamicAssetValueFromCoin({ currency, coinPrice, network, coinVal: sumDenom });
  }, [inProgressEntries, currency]);

  if (!inProgressEntries?.length) return null;

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger>
          <div className={cn(S.triggerTexts)}>
            <p className={cn(S.triggerProgressText)}>
              In progress <span className={cn(S.triggerCountText)}>{inProgressEntries?.length}</span>
            </p>
            <span className={cn(S.triggerAmountText)}>{totalUnbondingAmount}</span>
          </div>
        </AccordionInfoCard.Trigger>
        <AccordionInfoCard.Content>
          <AccordionInfoCard.Stack>
            {inProgressEntries?.map((item, index) => {
              const times = item.completionTime && getTimeUnitStrings(item.completionTime);

              return (
                <AccordionInfoCard.StackItem key={"unbonding-delegations" + network + index}>
                  <InfoCard.TitleBox>
                    <p className={cn(S.remainingDays)}>
                      {times?.time} {times?.unit} left
                    </p>
                  </InfoCard.TitleBox>
                  <InfoCard.Content>
                    {getDynamicAssetValueFromCoin({ currency, coinPrice, network, coinVal: item.amount })}
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
