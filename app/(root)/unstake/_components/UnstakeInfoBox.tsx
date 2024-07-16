"use client";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import * as InfoCard from "../../../_components/InfoCard";
import Tooltip from "@/app/_components/Tooltip";
import * as AccordionInfoCard from "../../../_components/AccordionInfoCard";
import { getTimeUnitStrings } from "../../../_utils/time";
import { getDynamicAssetValueFromCoin } from "../../../_utils/conversions";
import { useDialog } from "@/app/_contexts/UIContext";
import { useAleoAddressUnbondingStatus } from "../../../_services/aleo/hooks";
import { useUnbondingDelegations } from "../../../_services/stakingOperator/hooks";
import { defaultNetwork, unstakingPeriodByNetwork } from "../../../consts";
import * as S from "./unstake.css";

export const UnstakeInfoBox = () => {
  const { address } = useWallet();
  const { currency, coinPrice, network } = useShell();
  const { data: unbondingDelegations } = useUnbondingDelegations() || {};
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });
  const { toggleOpen: toggleClaimingProcedureDialog } = useDialog("claimingProcedure");

  const hasPendingItems = unbondingDelegations?.length || aleoUnstakeStatus !== null;
  const totalPendingItems = aleoUnstakeStatus !== null ? 1 : unbondingDelegations?.length || 0;
  const totalPendingAmount = useMemo(() => {
    if (!hasPendingItems) return undefined;

    const sumDenom =
      aleoUnstakeStatus?.amount ||
      unbondingDelegations
        ?.reduce((acc, { amount }) => {
          return acc.plus(amount);
        }, BigNumber(0))
        .toString() ||
      "0";

    return getDynamicAssetValueFromCoin({
      currency,
      coinPrice,
      network,
      coinVal: sumDenom,
    });
  }, [unbondingDelegations, currency, hasPendingItems]);

  if (!hasPendingItems) return null;

  if (aleoUnstakeStatus !== null) {
    const aleoUnbondingAmount = getDynamicAssetValueFromCoin({
      currency,
      coinPrice,
      network,
      coinVal: aleoUnstakeStatus.amount,
    });
    const times = aleoUnstakeStatus.completionTime && getTimeUnitStrings(aleoUnstakeStatus.completionTime);

    return (
      <InfoCard.Card>
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            {aleoUnstakeStatus.isWithdrawable ? (
              <Tooltip
                className={S.withdrawableTooltip}
                trigger={
                  <button className={S.withdrawButton} onClick={() => toggleClaimingProcedureDialog(true)}>
                    Withdraw
                  </button>
                }
                content={`You can withdraw ${aleoUnbondingAmount} now!`}
              />
            ) : (
              <p className={cn(S.remainingDays)}>
                {times
                  ? `${times.time} ${times?.unit} left`
                  : `${unstakingPeriodByNetwork[network || defaultNetwork]} left`}
              </p>
            )}
          </InfoCard.TitleBox>
          <InfoCard.Content>{aleoUnbondingAmount}</InfoCard.Content>
        </InfoCard.StackItem>
      </InfoCard.Card>
    );
  }

  return (
    <AccordionInfoCard.Root>
      <AccordionInfoCard.Item value="unbonding-delegations">
        <AccordionInfoCard.Trigger>
          <div className={cn(S.triggerTexts)}>
            <p className={cn(S.triggerProgressText)}>
              Pending <span className={cn(S.triggerCountText)}>{totalPendingItems}</span>
            </p>
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
          </AccordionInfoCard.Stack>
        </AccordionInfoCard.Content>
      </AccordionInfoCard.Item>
    </AccordionInfoCard.Root>
  );
};
