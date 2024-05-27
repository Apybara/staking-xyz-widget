"use client";
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
import { CTAButton, LinkCTAButton } from "../../../../_components/CTAButton";
import { RewardsTooltip } from "../../../_components/RewardsTooltip";
import { rewardsFrequencyByNetwork, defaultNetwork } from "../../../../consts";
import { useLinkWithSearchParams } from "../../../../_utils/routes";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useNetworkReward, useAddressRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import * as S from "./rewardsSummary.css";

export const RewardsSummary = () => {
  const { network } = useShell();
  const { stakedBalance, isLoading: isStakedBalanceLoading } = useStakedBalance() || {};
  const { rewards: networkRewards, isLoading: isNetworkRewardsLoading } =
    useNetworkReward({ amount: stakedBalance }) || {};
  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards()?.query || {};
  const { total_rewards, accrued_rewards } = addressRewards || {};
  const historyLink = useLinkWithSearchParams("rewards/history");
  const { toggleOpen: toggleClaimingProcedureDialog } = useDialog("claimingProcedure");

  const cumulativeRewards = total_rewards;
  const isCumulativeRewardsSmall =
    cumulativeRewards && BigNumber(cumulativeRewards).isLessThan(1) && BigNumber(cumulativeRewards).isGreaterThan(0);
  const formattedCumulative = useDynamicAssetValueFromCoin({
    coinVal: cumulativeRewards,
    minValue: !isCumulativeRewardsSmall ? undefined : 0.000001,
    formatOptions: !isCumulativeRewardsSmall ? undefined : { mantissa: 6 },
  });

  const isAccruedRewardsSmall =
    accrued_rewards && BigNumber(accrued_rewards).isLessThan(1) && BigNumber(accrued_rewards).isGreaterThan(0);
  const formattedAccruedRewards = useDynamicAssetValueFromCoin({
    coinVal: accrued_rewards,
    minValue: !isAccruedRewardsSmall ? undefined : 0.000001,
    formatOptions: !isAccruedRewardsSmall ? undefined : { mantissa: 6 },
  });

  // const nextCompounding = networkRewards?.nextCompounding || 0;
  const isEstRewardsLoading = isNetworkRewardsLoading || isStakedBalanceLoading;
  const isClaimDisabled =
    isAddressRewardsLoading || !accrued_rewards || isNaN(Number(accrued_rewards)) || Number(accrued_rewards) === 0;

  return (
    <>
      <WidgetContent>
        <section className={cn(S.card)}>
          <div className={cn(S.cardTitle)}>
            <h3>Cumulative rewards</h3>
            <Tooltip
              className={S.tooltip}
              trigger={<Icon name="info" />}
              content="This is the sum of all rewards claimed and compounded on this address."
            />
          </div>
          {isAddressRewardsLoading ? (
            <Skeleton width={140} height={24} />
          ) : (
            <p className={cn(S.cardValue)}>{formattedCumulative}</p>
          )}
        </section>
        <section className={cn(S.card)}>
          <div className={cn(S.cardTitle)}>
            <h3>Accrued rewards</h3>
            <Tooltip
              className={S.tooltip}
              trigger={<Icon name="info" />}
              content="This is the amount of rewards that have accrued but have yet to be claimed and compounded."
            />
          </div>
          {isAddressRewardsLoading ? (
            <Skeleton width={140} height={24} />
          ) : (
            <p className={cn(S.cardValue)}>{formattedAccruedRewards}</p>
          )}
        </section>
        <InfoCard.Card>
          <InfoCard.Stack>
            {/* <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Next compounding</InfoCard.Title>
                <Tooltip
                  className={S.tooltip}
                  trigger={<Icon name="info" />}
                  content="Compounding occurs when the accrued rewards are at least 1 TIA."
                />
              </InfoCard.TitleBox>
              <InfoCard.Content>
                {isEstRewardsLoading ? <Skeleton width={41.38} height={14} /> : `${nextCompounding} left`}
              </InfoCard.Content>
            </InfoCard.StackItem> */}
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
        {/* <a
          className={S.link}
          href={process.env.NEXT_PUBLIC_COMPOUNDING_INFO_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>More info about compounding</span>
          <Icon name="arrow" size={12} />
        </a> */}
      </WidgetContent>

      <WidgetBottomBox>
        <div className={cn(S.ctaButtons)}>
          <LinkCTAButton className={S.ctaButton} variant="secondary" href={historyLink}>
            View history
          </LinkCTAButton>
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
        </div>
      </WidgetBottomBox>
    </>
  );
};
