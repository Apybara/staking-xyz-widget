"use client";
import { useShell } from "../../../_contexts/ShellContext";
// import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
// import { feeRatioByNetwork } from "../../../consts";
// import Tooltip from "@/app/_components/Tooltip";
// import { Icon } from "@/app/_components/Icon";
import { useExternalDelegations, useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import * as InfoCard from "../../../_components/InfoCard";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import * as S from "./redelegate.css";

export const RedelegateInfoBox = () => {
  const { network } = useShell();
  // const formattedStakeFees = useDynamicAssetValueFromCoin({ coinVal: 1.2 });
  // const platformFee = feeRatioByNetwork[network || "celestia"] * 100;
  const externalDelegations = useExternalDelegations();
  const { redelegationAmount } = externalDelegations?.data || {};

  const networkReward = useNetworkReward({ amount: redelegationAmount });

  return (
    <InfoCard.Card className={S.infoBox}>
      <InfoCard.Stack className={S.infoBoxStack}>
        <InfoCard.StackItem className={S.rewardInfo}>
          <InfoCard.TitleBox>
            <InfoCard.Title className={S.infoBoxText({})}>Est. reward rate</InfoCard.Title>
            <RewardsTooltip amount={redelegationAmount} />
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.rewardInfoContent}>
            {/* <span className={S.rewardInfoValueSlashed}>15.21%</span>
            <Icon name="arrow" /> */}
            <span className={S.infoBoxText({ state: "up" })}>{networkReward?.rewards.percentage}%</span>
          </InfoCard.Content>
        </InfoCard.StackItem>
        {/* <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title className={S.infoBoxText({})}>Total fees</InfoCard.Title>

            <Tooltip
              trigger={<Icon name="info" />}
              content={
                <>
                  Network fee <span className={S.plusSign}>+</span> Platform fee ({platformFee}%)
                </>
              }
            />
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.infoBoxText({ state: "down" })}>{formattedStakeFees}</InfoCard.Content>
        </InfoCard.StackItem> */}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
