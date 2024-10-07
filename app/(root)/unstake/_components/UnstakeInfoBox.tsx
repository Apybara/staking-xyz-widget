"use client";
import { useMemo } from "react";
import { Arrow } from "@radix-ui/react-tooltip";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import * as InfoCard from "../../../_components/InfoCard";
import type { StakingType } from "@/app/types";
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
  const { network } = useShell();
  const { data: unbondingDelegations } = useUnbondingDelegations() || {};
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });

  const hasPendingItems = unbondingDelegations?.length || aleoUnstakeStatus !== null;

  if (!hasPendingItems) return null;
  if (aleoUnstakeStatus !== null) return <AleoUnstakeInfo />;
  return <DefaultUnstakeInfo />;
};

const AleoUnstakeInfo = () => {
  const { address } = useWallet();
  const { currency, coinPrice, network, stakingType } = useShell();
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });
  const { toggleOpen: toggleClaimingProcedureDialog } = useDialog("claimingProcedure");

  const isLiquid = stakingType === "liquid";
  const unstakingPeriod = unstakingPeriodByNetwork[network || defaultNetwork][stakingType as StakingType];
  const aleoUnbondingAmount = getDynamicAssetValueFromCoin({
    currency,
    coinPrice,
    network,
    coinVal: aleoUnstakeStatus?.amount,
  });
  const times = aleoUnstakeStatus?.completionTime && getTimeUnitStrings(aleoUnstakeStatus.completionTime);
  const remainingTimeString = times ? `${times.time} ${times?.unit} left` : `${unstakingPeriod} left`;

  const titleContent = useMemo(() => {
    if (aleoUnstakeStatus?.isWithdrawable) {
      return (
        <Tooltip
          className={S.withdrawableTooltip}
          trigger={
            <button className={S.withdrawButton} onClick={() => toggleClaimingProcedureDialog(true)}>
              Withdraw
            </button>
          }
          content={
            <>
              {`You can withdraw ${aleoUnbondingAmount} now!`}
              <Arrow className={S.withdrawTooltipArrow} />
            </>
          }
        />
      );
    }

    return <p className={cn(S.remainingDays)}>{remainingTimeString}</p>;
  }, [isLiquid, aleoUnstakeStatus?.isWithdrawable, aleoUnbondingAmount, remainingTimeString]);

  if (!aleoUnstakeStatus) return null;

  return (
    <InfoCard.Card>
      <InfoCard.StackItem>
        <InfoCard.TitleBox>{titleContent}</InfoCard.TitleBox>
        <InfoCard.Content>{aleoUnbondingAmount}</InfoCard.Content>
      </InfoCard.StackItem>
    </InfoCard.Card>
  );
};

const DefaultUnstakeInfo = () => {
  const { currency, coinPrice, network, stakingType } = useShell();
  const { data: unbondingDelegations } = useUnbondingDelegations() || {};
  const unstakingPeriod = unstakingPeriodByNetwork[network || defaultNetwork][stakingType as StakingType];
  const hasPendingItems = unbondingDelegations?.length;
  const totalPendingItems = unbondingDelegations?.length || 0;

  const totalPendingAmount = useMemo(() => {
    if (!hasPendingItems) return undefined;

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
      coinVal: sumDenom,
    });
  }, [unbondingDelegations, currency, hasPendingItems]);

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
                      {times ? `${times.time} ${times?.unit} left` : `${unstakingPeriod} left`}
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
