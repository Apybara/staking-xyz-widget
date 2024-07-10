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
import { useUnbondingDelegations } from "../../../_services/stakingOperator/hooks";
import { defaultNetwork, unstakingPeriodByNetwork } from "../../../consts";
import * as S from "./unstake.css";

export const UnstakeInfoBox = () => {
  const { currency, coinPrice, network } = useShell();

  const { data: unbondingDelegations } = useUnbondingDelegations() || {};

  const unboundingAmounts = useMemo(() => {
    if (!unbondingDelegations?.length) return undefined;

    const totalUnbondingAmount =
      unbondingDelegations
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    const totalWithdrawableAmount =
      unbondingDelegations
        ?.filter(({ type }) => type === "withdraw")
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() || "0";

    return {
      totalUnbondingAmount: getDynamicAssetValueFromCoin({
        currency,
        coinPrice,
        network,
        coinVal: totalUnbondingAmount,
      }),
      totalWithdrawableAmount: getDynamicAssetValueFromCoin({
        currency,
        coinPrice,
        network,
        coinVal: totalWithdrawableAmount,
      }),
    };
  }, [unbondingDelegations, currency]);

  const { totalUnbondingAmount, totalWithdrawableAmount } = unboundingAmounts || {};

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger>
          <div className={cn(S.triggerTexts)}>
            {!!totalWithdrawableAmount ? (
              <Tooltip
                className={S.withdrawableTooltip}
                trigger={
                  <div className={S.unstakingStatus}>
                    <p className={cn(S.triggerProgressText)}>
                      Pending <span className={cn(S.triggerCountText)}>{unbondingDelegations?.length}</span>
                    </p>
                    <span className={S.withdrawableStatus}></span>
                  </div>
                }
                content={`You can withdraw ${totalWithdrawableAmount} now!`}
              />
            ) : (
              <p className={cn(S.triggerProgressText)}>
                Pending <span className={cn(S.triggerCountText)}>{unbondingDelegations?.length}</span>
              </p>
            )}
            <span className={cn(S.triggerAmountText)}>{totalUnbondingAmount}</span>
          </div>
        </AccordionInfoCard.Trigger>
        <AccordionInfoCard.Content>
          <AccordionInfoCard.Stack>
            {unbondingDelegations?.map((item, index) => {
              const times = item.completionTime && getTimeUnitStrings(item.completionTime);
              const isWithdrawable = item.type === "withdraw";

              return (
                <AccordionInfoCard.StackItem key={"unbonding-delegations" + network + index}>
                  <InfoCard.TitleBox>
                    {isWithdrawable ? (
                      <button className={S.withdrawButton}>Withdraw</button>
                    ) : (
                      <p className={cn(S.remainingDays)}>
                        {times
                          ? `${times.time} ${times?.unit} left`
                          : `${unstakingPeriodByNetwork[network || defaultNetwork]} left`}
                      </p>
                    )}
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
