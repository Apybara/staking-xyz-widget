"use client";
import type { BasicTxCtaValidationResult } from "@/app/_utils/transaction";
import { useMemo } from "react";
import { Arrow } from "@radix-ui/react-tooltip";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import type { StakingType } from "@/app/types";
import Tooltip from "@/app/_components/Tooltip";
import * as AccordionInfoCard from "../../../_components/AccordionInfoCard";
import { getTimeUnitStrings } from "../../../_utils/time";
import { getDynamicAssetValueFromCoin } from "../../../_utils/conversions";
import { useDialog } from "@/app/_contexts/UIContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
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
  const { address, activeWallet } = useWallet();
  const { currency, coinPrice, network, stakingType } = useShell();
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });
  const { ctaState } = useUnstaking();
  const { data: walletBalance } = useWalletBalance({ address, network: "aleo", activeWallet }) || {};

  const unstakingPeriod = unstakingPeriodByNetwork[network || defaultNetwork][stakingType as StakingType];
  const aleoUnbondingAmount = getDynamicAssetValueFromCoin({
    currency,
    coinPrice,
    network,
    coinVal: aleoUnstakeStatus?.amount,
  });
  const times = aleoUnstakeStatus?.completionTime && getTimeUnitStrings(aleoUnstakeStatus.completionTime);
  const remainingTimeString = times ? `${times.time} ${times?.unit} left` : `${unstakingPeriod} left`;

  if (!aleoUnstakeStatus || !aleoUnbondingAmount || !walletBalance) return null;

  return (
    <InfoCard.Card>
      <InfoCard.StackItem>
        <InfoCard.TitleBox>
          <AleoTitleContent
            isWithdrawable={aleoUnstakeStatus.isWithdrawable}
            aleoUnbondingAmount={aleoUnbondingAmount}
            remainingTimeString={remainingTimeString}
            ctaState={ctaState}
            walletBalance={walletBalance}
          />
        </InfoCard.TitleBox>
        <InfoCard.Content>{aleoUnbondingAmount}</InfoCard.Content>
      </InfoCard.StackItem>
    </InfoCard.Card>
  );
};

const AleoTitleContent = ({
  isWithdrawable,
  aleoUnbondingAmount,
  remainingTimeString,
  ctaState,
  walletBalance,
}: {
  isWithdrawable: boolean;
  aleoUnbondingAmount: string;
  remainingTimeString: string;
  ctaState: BasicTxCtaValidationResult;
  walletBalance: string;
}) => {
  const isLiquid = useShell().stakingType === "liquid";
  const { toggleOpen: toggleClaimingProcedureDialog } = useDialog("claimingProcedure");

  const hasPendingTxs = ctaState === "pendingTxs";
  const hasSufficientBalanceForFees = BigNumber(walletBalance).isGreaterThanOrEqualTo(0.15);

  const tooltipText = useMemo(() => {
    if (hasPendingTxs) return "Please wait for the previous transaction to confirm.";
    if (!hasSufficientBalanceForFees) return "Insufficient balance for fees.";
    if (isLiquid) return "You need to withdraw before making a new unstaking request.";
    return `You can withdraw ${aleoUnbondingAmount} now!`;
  }, [hasPendingTxs, isLiquid, hasSufficientBalanceForFees, aleoUnbondingAmount]);

  const ctaText = useMemo(() => {
    if (hasPendingTxs) return "Withdrawing";
    if (!hasSufficientBalanceForFees) return "Withdraw";
    return "Withdraw";
  }, [hasPendingTxs, hasSufficientBalanceForFees]);

  const statusVariant = useMemo(() => {
    if (hasPendingTxs) return "neutral";
    if (!hasSufficientBalanceForFees) return "warning";
    return "active";
  }, [hasPendingTxs, hasSufficientBalanceForFees]);

  if (isWithdrawable) {
    return (
      <Tooltip
        className={S.withdrawableTooltip({ variant: statusVariant })}
        trigger={
          <button
            className={S.withdrawButton({ variant: statusVariant })}
            disabled={statusVariant !== "active"}
            onClick={() => toggleClaimingProcedureDialog(true)}
          >
            {ctaText}
          </button>
        }
        content={
          <>
            {tooltipText}
            <Arrow className={S.withdrawTooltipArrow({ variant: statusVariant })} />
          </>
        }
      />
    );
  }

  return <p className={cn(S.remainingDays)}>{remainingTimeString}</p>;
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
