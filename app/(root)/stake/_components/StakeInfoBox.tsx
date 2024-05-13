"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { feeRatioByNetwork, unstakingPeriodByNetwork, defaultNetwork } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import * as S from "./stake.css";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";

export const StakeInfoBox = () => {
  const { network } = useShell();
  const { stakeFees, coinAmountInput } = useStaking();
  const networkReward = useNetworkReward({ amount: coinAmountInput });
  const formattedStakeFees = useDynamicAssetValueFromCoin({ coinVal: stakeFees });

  const unstakingPeriod = unstakingPeriodByNetwork[network || defaultNetwork];
  const platformFee = feeRatioByNetwork[network || defaultNetwork] * 100;

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem className={S.rewardInfo}>
          <InfoCard.TitleBox>
            <InfoCard.Title>Est. reward rate</InfoCard.Title>
            {stakeFees && <RewardsTooltip amount={coinAmountInput} />}
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.rewardInfoValue}>{networkReward?.rewards.percentage}%</InfoCard.Content>
        </InfoCard.StackItem>
        {stakeFees && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Total fees</InfoCard.Title>

              <Tooltip
                trigger={<Icon name="info" />}
                content={
                  <>
                    Network fee <span className={S.plusSign}>+</span> Platform fee ({platformFee}%)
                  </>
                }
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedStakeFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {stakeFees && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Unstaking period</InfoCard.Title>

              <Tooltip
                className={S.unstakingTooltip}
                trigger={<Icon name="info" />}
                content={<>It takes {unstakingPeriod} for unstaking to be completed.</>}
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{unstakingPeriod}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
