"use client";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { Skeleton } from "@/app/_components/Skeleton";
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
  const { isLoading: isLoadingTotalEntries, totalEntries } = unstakeActivityTotalQuery || {};
  const { query: unstakeActivityQuery } =
    useActivity({
      filterKey: "transactions_unstake",
      offset: 0,
      limit: totalEntries || 999,
    }) || {};
  const { isLoading: isLoadingFormattedEntries, formattedEntries } = unstakeActivityQuery || {};

  const isLoading = isLoadingTotalEntries || isLoadingFormattedEntries;
  const isEmpty = !formattedEntries?.length && !isLoading;

  const totalUnbondingAmount = useMemo(() => {
    if (isLoading) return <Skeleton width={68} height={12} />;

    const sumDenom =
      formattedEntries
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    return getDynamicAssetValueFromCoin({ currency, coinPrice, network, coinVal: sumDenom });
  }, [isLoading, totalEntries, formattedEntries, currency]);

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger className={S.triggerButton} disabled={isLoading || isEmpty}>
          <div className={cn(S.triggerTexts({ state: isEmpty ? "disabled" : "default" }))}>
            {isEmpty ? (
              <p className={cn(S.triggerProgressText)}>No unstaking in progress</p>
            ) : (
              <>
                <p className={cn(S.triggerProgressText)}>
                  In progress {!isLoading && <span className={cn(S.triggerCountText)}>{totalEntries}</span>}
                </p>
                <span className={cn(S.triggerAmountText)}>{totalUnbondingAmount}</span>
              </>
            )}
          </div>
        </AccordionInfoCard.Trigger>
        <AccordionInfoCard.Content>
          <AccordionInfoCard.Stack>
            {formattedEntries?.map((item, index) => {
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
