"use client";
import { useMemo } from "react";
import cn from "classnames";
import BigNumber from "bignumber.js";
import { useDialog } from "../../../../_contexts/UIContext";
import { useShell } from "../../../../_contexts/ShellContext";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { WidgetContent } from "@/app/_components/WidgetContent";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "../../../../_components/Icon";
import { Skeleton } from "../../../../_components/Skeleton";
import * as InfoCard from "../../../../_components/InfoCard";
import { CTAButton } from "../../../../_components/CTAButton";
import { RewardsTooltip } from "../../../_components/RewardsTooltip";
import { rewardsFrequencyByNetwork, defaultNetwork } from "../../../../consts";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useNetworkReward, useAddressRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";
import * as S from "./rewardsSummary.css";

export const RewardsSummary = () => {
  const { network } = useShell();
  const { stakedBalance, isLoading: isStakedBalanceLoading } = useStakedBalance() || {};
  const { rewards: networkRewards, isLoading: isNetworkRewardsLoading } =
    useNetworkReward({ amount: stakedBalance }) || {};
  const isEstRewardsLoading = isNetworkRewardsLoading || isStakedBalanceLoading;

  const isAleo = getIsAleoNetwork(network);

  return (
    <>
      <WidgetContent>
        {!isAleo && <FirstSection />}
        <SecondSection />
        <InfoCard.Card>
          <InfoCard.Stack>
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Est. reward rate</InfoCard.Title>
                <RewardsTooltip amount={stakedBalance} />
              </InfoCard.TitleBox>
              <InfoCard.Content className={S.rewardInfoValue}>
                {isEstRewardsLoading ? (
                  <Skeleton width={41.38} height={14} />
                ) : (
                  <span>{networkRewards?.percentage}%</span>
                )}
              </InfoCard.Content>
            </InfoCard.StackItem>
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Reward frequency</InfoCard.Title>
              </InfoCard.TitleBox>
              <InfoCard.Content>{rewardsFrequencyByNetwork[network || defaultNetwork]}</InfoCard.Content>
            </InfoCard.StackItem>
          </InfoCard.Stack>
        </InfoCard.Card>
      </WidgetContent>

      <ClaimBox />
    </>
  );
};

const FirstSection = () => {
  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards() || {};
  const { cumulativeRewards, accruedRewards, lastNativeRewardsIndexedTime } = addressRewards || {};

  const bigNumberCumulativeRewards = BigNumber(cumulativeRewards || 0);
  const isCumulativeRewardsNegativeOrZero = bigNumberCumulativeRewards.isLessThanOrEqualTo(0);
  const isCumulativeRewardsSmall =
    cumulativeRewards && bigNumberCumulativeRewards.isLessThan(1) && bigNumberCumulativeRewards.isGreaterThan(0);
  const formattedCumulative = useDynamicAssetValueFromCoin({
    coinVal: isCumulativeRewardsNegativeOrZero ? 0 : cumulativeRewards,
    minValue: !isCumulativeRewardsSmall ? undefined : 0.000001,
    formatOptions: !isCumulativeRewardsSmall ? undefined : { mantissa: 6 },
  });

  const tooltipCopy = useMemo(() => {
    if (accruedRewards) {
      return "This is the sum of all rewards claimed on this address.";
    }

    const timeString = lastNativeRewardsIndexedTime ? `Calculated at ${lastNativeRewardsIndexedTime} UTC` : "";
    if (!formattedCumulative || isCumulativeRewardsNegativeOrZero) {
      return `Sum of all staking rewards earned. ${timeString}. If you just staked, new rewards will be updated in 5 mins.`;
    }
    return `Sum of all staking rewards earned. ${timeString}. Updates every 5 mins.`;
  }, [accruedRewards, lastNativeRewardsIndexedTime, formattedCumulative, isCumulativeRewardsNegativeOrZero]);

  return (
    <section className={cn(S.card)}>
      <div className={cn(S.cardTitle)}>
        <h3>Cumulative rewards</h3>
        <Tooltip className={S.tooltip} trigger={<Icon name="info" />} content={tooltipCopy} />
      </div>
      {isAddressRewardsLoading ? (
        <Skeleton width={140} height={24} />
      ) : (
        <p className={cn(S.cardValue)}>{formattedCumulative}</p>
      )}
    </section>
  );
};

const SecondSection = () => {
  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards() || {};

  const { stakedBalance } = useStakedBalance() || {};
  const { rewards, isLoading: isRewardsLoading } = useNetworkReward({ amount: stakedBalance }) || {};

  const hasAccruedRewards = addressRewards && addressRewards.accruedRewards;
  const title = hasAccruedRewards ? "Accrued rewards" : "Est. daily rewards";
  const accruedRewards = hasAccruedRewards ? addressRewards.accruedRewards : 0;
  const isAccruedRewardsSmall =
    accruedRewards && BigNumber(accruedRewards).isLessThan(1) && BigNumber(accruedRewards).isGreaterThan(0);
  const isLoading = hasAccruedRewards ? isAddressRewardsLoading : isRewardsLoading;

  const formattedDailyReward = useDynamicAssetValueFromCoin({ coinVal: rewards?.daily });
  const formattedAccruedRewards = useDynamicAssetValueFromCoin({
    coinVal: accruedRewards,
    minValue: !isAccruedRewardsSmall ? undefined : 0.000001,
    formatOptions: !isAccruedRewardsSmall ? undefined : { mantissa: 6 },
  });
  const value = hasAccruedRewards ? formattedAccruedRewards : formattedDailyReward;

  return (
    <section className={cn(S.card)}>
      <div className={cn(S.cardTitle)}>
        <h3>{title}</h3>
        {hasAccruedRewards && (
          <Tooltip
            className={S.tooltip}
            trigger={<Icon name="info" />}
            content="This is the amount of rewards that have accrued but have yet to be claimed."
          />
        )}
      </div>
      {isLoading ? <Skeleton width={140} height={24} /> : <p className={cn(S.cardValue)}>{value}</p>}
    </section>
  );
};

const ClaimBox = () => {
  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards() || {};
  const { toggleOpen: toggleClaimingProcedureDialog } = useDialog("claimingProcedure");

  const { accruedRewards } = addressRewards || {};
  const shouldShowClaimButton = accruedRewards !== null && accruedRewards !== undefined;
  const isClaimDisabled =
    isAddressRewardsLoading || !accruedRewards || isNaN(Number(accruedRewards)) || Number(accruedRewards) === 0;

  if (!shouldShowClaimButton) return null;

  return (
    <WidgetBottomBox>
      <CTAButton
        variant="primary"
        state={isClaimDisabled ? "disabled" : "default"}
        disabled={isClaimDisabled}
        onClick={() => {
          if (isClaimDisabled) return;
          toggleClaimingProcedureDialog(true);
        }}
      >
        Claim
      </CTAButton>
    </WidgetBottomBox>
  );
};
