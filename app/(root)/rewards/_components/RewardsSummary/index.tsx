"use client";
import cn from "classnames";
import { useShell } from "../../../../_contexts/ShellContext";
import { Icon } from "../../../../_components/Icon";
import * as InfoCard from "../../../../_components/InfoCard";
import { LinkCTAButton } from "../../../../_components/CTAButton";
import { RewardsTooltip } from "../../../_components/RewardsTooltip";
import { rewardsFrequencyByNetwork, defaultNetwork } from "../../../../consts";
import { getTimeTillMidnight } from "../../../../_utils/time";
import { useLinkWithSearchParams } from "../../../../_utils/routes";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useNetworkReward, useRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import * as S from "./rewardsSummary.css";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { WidgetContent } from "@/app/_components/WidgetContent";
import BigNumber from "bignumber.js";
import Tooltip from "@/app/_components/Tooltip";

export const RewardsSummary = () => {
  const { network } = useShell();
  const { stakedBalance } = useStakedBalance() || {};
  const networkReward = useNetworkReward();
  const historyLink = useLinkWithSearchParams("rewards/history");

  const { query } = useRewards();
  const { total_rewards, last_cycle_rewards } = query?.data || {};

  const formattedCumulative = useDynamicAssetValueFromCoin({ coinVal: total_rewards });
  const formattedCycleReward = useDynamicAssetValueFromCoin({ coinVal: last_cycle_rewards });
  const formattedNextCompounding = getTimeTillMidnight();

  const isRewardsSmall = last_cycle_rewards && BigNumber(last_cycle_rewards).isLessThan(1);

  return (
    <>
      <WidgetContent>
        <section className={cn(S.card)}>
          <h3 className={cn(S.cardTitle)}>Cumulative</h3>
          <p className={cn(S.cardValue)}>{formattedCumulative}</p>
        </section>
        <section className={cn(S.card)}>
          <h3 className={cn(S.cardTitle)}>Rewards from this cycle</h3>
          <p className={cn(S.cardValue)}>{formattedCycleReward}</p>
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
              <InfoCard.Content className={S.rewardInfoValue}>{networkReward?.rewards.percentage}%</InfoCard.Content>
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
