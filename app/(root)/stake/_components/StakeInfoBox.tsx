"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { feeRatioByNetwork, unstakingPeriodByNetwork } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import * as S from "./stake.css";

export const StakeInfoBox = () => {
  const { network } = useShell();
  const { stakeFees } = useStaking();
  const formattedStakeFees = useDynamicAssetValueFromCoin({ coinVal: stakeFees });

  const unstakingPeriod = unstakingPeriodByNetwork[network || "celestia"];
  const platformFee = feeRatioByNetwork[network || "celestia"] * 100;

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Reward</InfoCard.Title>
            <RewardsTooltip />
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.rewardInfoValue}>00.00%</InfoCard.Content>
        </InfoCard.StackItem>
        {stakeFees && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Total fees</InfoCard.Title>

              <Tooltip
                trigger={<Icon name="question" />}
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
                trigger={<Icon name="question" />}
                content={<>When you unstake, you will need to wait for {unstakingPeriod}.</>}
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{unstakingPeriod}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
