"use client";
import { useShell } from "../../../_contexts/ShellContext";
import * as InfoCard from "../../../_components/InfoCard";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { feeRatioByNetwork } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import * as S from "./import.css";

export const ImportInfoBox = () => {
  const { network } = useShell();
  const formattedStakeFees = useDynamicAssetValueFromCoin({ coinVal: 1.2 });

  const platformFee = feeRatioByNetwork[network || "celestia"] * 100;

  return (
    <InfoCard.Card className={S.infoBox}>
      <InfoCard.Stack className={S.infoBoxStack}>
        <InfoCard.StackItem className={S.rewardInfo}>
          <InfoCard.TitleBox>
            <InfoCard.Title className={S.infoBoxText({})}>Reward</InfoCard.Title>
            <RewardsTooltip />
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.rewardInfoContent}>
            <span className={S.rewardInfoValueSlashed}>15.21%</span>
            <Icon name="arrow" />
            <span className={S.infoBoxText({ state: "up" })}>15.63%</span>
          </InfoCard.Content>
        </InfoCard.StackItem>
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title className={S.infoBoxText({})}>Total fees</InfoCard.Title>

            <Tooltip
              trigger={<Icon name="question" />}
              content={
                <>
                  Network fee <span className={S.plusSign}>+</span> Platform fee ({platformFee}%)
                </>
              }
            />
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.infoBoxText({ state: "down" })}>{formattedStakeFees}</InfoCard.Content>
        </InfoCard.StackItem>
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
