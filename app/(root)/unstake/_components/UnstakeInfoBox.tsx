"use client";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import * as InfoCard from "../../../_components/InfoCard";
import Tooltip from "@/app/_components/Tooltip";
import * as AccordionInfoCard from "../../../_components/AccordionInfoCard";
import { getTimeUnitStrings } from "../../../_utils/time";
import { getDynamicAssetValueFromCoin } from "../../../_utils/conversions";
import { useUnbondingDelegations, useWithdrawableAmount } from "../../../_services/stakingOperator/hooks";
import { defaultNetwork, unstakingPeriodByNetwork } from "../../../consts";
import * as S from "./unstake.css";

export const UnstakeInfoBox = () => {
  const { currency, coinPrice, network, stakingType } = useShell();

  const { data: unbondingDelegations } = useUnbondingDelegations() || {};
  const { data: withdrawableData } = useWithdrawableAmount() || {};

  const { withdrawableAmount } = withdrawableData || {};
  const hasWithdrawableAmount = !!withdrawableAmount && withdrawableAmount !== "0";
  const formattedWithdrawableAmount = getDynamicAssetValueFromCoin({
    currency,
    coinPrice,
    network,
    coinVal: withdrawableAmount,
  });

  const totalPendingAmount = useMemo(() => {
    if (!unbondingDelegations?.length) return undefined;

    const sumDenom =
      unbondingDelegations
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    return getDynamicAssetValueFromCoin({
      currency,
      coinPrice,
      network,
      coinVal: BigNumber(sumDenom)
        .plus(withdrawableAmount || 0)
        .toString(),
    });
  }, [unbondingDelegations, currency]);

  const totalPendingItems = BigNumber(unbondingDelegations?.length || 0)
    .plus(hasWithdrawableAmount ? 1 : 0)
    .toString();

  if (totalPendingItems === "0") return null;

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger>
          <div className={cn(S.triggerTexts)}>
            {hasWithdrawableAmount ? (
              <Tooltip
                className={S.withdrawableTooltip}
                trigger={
                  <div className={S.unstakingStatus}>
                    <p className={cn(S.triggerProgressText)}>
                      Pending <span className={cn(S.triggerCountText)}>{totalPendingItems}</span>
                    </p>
                    <span className={S.withdrawableStatus}></span>
                  </div>
                }
                content={`You can withdraw ${formattedWithdrawableAmount} now!`}
              />
            ) : (
              <p className={cn(S.triggerProgressText)}>
                Pending <span className={cn(S.triggerCountText)}>{totalPendingItems}</span>
              </p>
            )}
            <span className={cn(S.triggerAmountText)}>{totalPendingAmount}</span>
          </div>
        </AccordionInfoCard.Trigger>
        <AccordionInfoCard.Content>
          <AccordionInfoCard.Stack>
            {unbondingDelegations?.map((item, index) => {
              const times = item.completionTime && getTimeUnitStrings(item.completionTime);

              return (
                <AccordionInfoCard.StackItem key={"unbonding-delegations" + network + index}>
                  <InfoCard.TitleBox>
                    <p className={cn(S.remainingDays)}>
                      {times
                        ? `${times.time} ${times?.unit} left`
                        : `${unstakingPeriodByNetwork[network || defaultNetwork]} left`}
                    </p>
                  </InfoCard.TitleBox>
                  <InfoCard.Content>
                    {getDynamicAssetValueFromCoin({ currency, coinPrice, network, coinVal: item.amount })}
                  </InfoCard.Content>
                </AccordionInfoCard.StackItem>
              );
            })}
            {!!hasWithdrawableAmount && (
              <AccordionInfoCard.StackItem>
                <InfoCard.TitleBox>
                  <button className={S.withdrawButton}>Withdraw</button>
                </InfoCard.TitleBox>
                <InfoCard.Content>{formattedWithdrawableAmount}</InfoCard.Content>
              </AccordionInfoCard.StackItem>
            )}
          </AccordionInfoCard.Stack>
        </AccordionInfoCard.Content>
      </AccordionInfoCard.Item>
    </AccordionInfoCard.Root>
  );
};
