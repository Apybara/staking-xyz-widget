"use client";
import cn from "classnames";
import { fromUnixTime } from "date-fns";
import { useShell } from "../../../../_contexts/ShellContext";
import { Icon } from "../../../../_components/Icon";
import * as InfoCard from "../../../../_components/InfoCard";
import { LinkCTAButton } from "../../../../_components/CTAButton";
import { RewardsTooltip } from "../../../_components/RewardsTooltip";
import { rewardsFrequencyByNetwork } from "../../../../consts";
import { getTimeDiffInSingleString } from "../../../../_utils/time";
import { useLinkWithSearchParams } from "../../../../_utils/routes";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import * as S from "./rewardsSummary.css";

export const RewardsSummary = () => {
  const { network } = useShell();
  const historyLink = useLinkWithSearchParams("rewards/history");
  const formattedCumulative = useDynamicAssetValueFromCoin({ coinVal: 205.72 });
  const formattedCycleReward = useDynamicAssetValueFromCoin({ coinVal: 0.015041 });
  const formattedNextCompounding = getTimeDiffInSingleString(fromUnixTime(1745099829));

  return (
    <>
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
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedNextCompounding} left</InfoCard.Content>
          </InfoCard.StackItem>
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Reward</InfoCard.Title>
              <RewardsTooltip />
            </InfoCard.TitleBox>
            <InfoCard.Content className={S.rewardInfoValue}>00.00%</InfoCard.Content>
          </InfoCard.StackItem>
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Reward frequency</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{rewardsFrequencyByNetwork[network || "celestia"]}</InfoCard.Content>
          </InfoCard.StackItem>
        </InfoCard.Stack>
      </InfoCard.Card>
      {/* TODO: update URL */}
      <a className={S.link} href="#" target="_blank" rel="noopener noreferrer">
        <span>More info about compounding</span>
        <Icon name="arrow" size={12} />
      </a>
      <LinkCTAButton className={S.ctaButton} variant="secondary" href={historyLink}>
        View history
      </LinkCTAButton>
    </>
  );
};
