"use client";
import cn from "classnames";
import { useShell } from "../../../../_contexts/ShellContext";
import { Icon } from "../../../../_components/Icon";
import { Skeleton } from "../../../../_components/Skeleton";
import * as InfoCard from "../../../../_components/InfoCard";
import { LinkCTAButton } from "../../../../_components/CTAButton";
import { RewardsTooltip } from "../../../_components/RewardsTooltip";
import { rewardsFrequencyByNetwork, defaultNetwork } from "../../../../consts";
import { getTimeTillMidnight } from "../../../../_utils/time";
import { useLinkWithSearchParams } from "../../../../_utils/routes";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useNetworkReward, useAddressRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import * as S from "./rewardsSummary.css";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { WidgetContent } from "@/app/_components/WidgetContent";
import BigNumber from "bignumber.js";
import Tooltip from "@/app/_components/Tooltip";

export const RewardsSummary = () => {
  const { network } = useShell();
  const { stakedBalance, isLoading: isStakedBalanceLoading } = useStakedBalance() || {};
  const { rewards: networkRewards, isLoading: isNetworkRewardsLoading } =
    useNetworkReward({ amount: stakedBalance }) || {};
  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards()?.query || {};
  const { total_rewards, last_cycle_rewards } = addressRewards || {};
  const historyLink = useLinkWithSearchParams("rewards/history");

  const formattedCumulative = useDynamicAssetValueFromCoin({ coinVal: total_rewards });
  const dailyRewards = networkRewards?.daily;
  const isEstRewardsSmall = (dailyRewards || 0) < 1;
  const formattedCycleReward = useDynamicAssetValueFromCoin({
    coinVal: dailyRewards,
    minValue: !isEstRewardsSmall ? undefined : 0.000001,
    formatOptions: !isEstRewardsSmall ? undefined : { mantissa: 6 },
  });
  const formattedNextCompounding = getTimeTillMidnight();
  const isRewardsSmall = last_cycle_rewards && BigNumber(last_cycle_rewards).isLessThan(1);
  const isEstRewardsLoading = isNetworkRewardsLoading || isStakedBalanceLoading;

  return (
    <>
      <WidgetContent>
        <section className={cn(S.card)}>
          <h3 className={cn(S.cardTitle)}>Cumulative</h3>
          {isAddressRewardsLoading ? (
            <Skeleton width={140} height={24} />
          ) : (
            <p className={cn(S.cardValue)}>{formattedCumulative}</p>
          )}
        </section>
        <section className={cn(S.card)}>
          <h3 className={cn(S.cardTitle)}>Est. rewards from next cycle</h3>
          {isEstRewardsLoading ? (
            <Skeleton width={140} height={24} />
          ) : (
            <p className={cn(S.cardValue)}>{formattedCycleReward}</p>
          )}
        </section>
        <InfoCard.Card>
          <InfoCard.Stack>
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Next compounding</InfoCard.Title>
                {isRewardsSmall && (
                  <Tooltip
                    className={S.tooltip}
                    trigger={<Icon name="info" />}
                    content="The app will only compound if you have more than 1 TIA of staking rewards accrued."
                  />
                )}
              </InfoCard.TitleBox>
              <InfoCard.Content>{isRewardsSmall ? "-" : `${formattedNextCompounding} left`}</InfoCard.Content>
            </InfoCard.StackItem>
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
        <a
          className={S.link}
          href={process.env.NEXT_PUBLIC_COMPOUNDING_INFO_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>More info about compounding</span>
          <Icon name="arrow" size={12} />
        </a>
      </WidgetContent>

      <WidgetBottomBox>
        <LinkCTAButton className={S.ctaButton} variant="secondary" href={historyLink}>
          View history
        </LinkCTAButton>
      </WidgetBottomBox>
    </>
  );
};
