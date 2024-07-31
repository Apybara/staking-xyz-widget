"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { feeRatioByNetwork, unstakingPeriodByNetwork, defaultNetwork, aleoDefaultStakeFee } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useStakeValidatorState } from "@/app/_contexts/StakingContext/hooks";
// import { getStakeFees } from "@/app/_utils/transaction";
import * as S from "./stake.css";
import { getMicroCreditsToCredits } from "@/app/_services/aleo/utils";
import { getTokenEquivalent } from "@/app/_utils/conversions";

export const StakeInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useStaking();
  const networkReward = useNetworkReward({ amount: coinAmountInput });
  const { validatorDetails } = useStakeValidatorState();
  // const stakeFees = getStakeFees({ amount: coinAmountInput, network: network || defaultNetwork });
  // const formattedStakeFees = useDynamicAssetValueFromCoin({ coinVal: stakeFees });
  // const platformFee = feeRatioByNetwork[network || defaultNetwork] * 100;
  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isNative = stakingType === "native";
  const formattedTotalFees = useDynamicAssetValueFromCoin({ coinVal: getMicroCreditsToCredits(aleoDefaultStakeFee) });
  const unstakingPeriod = unstakingPeriodByNetwork[network || defaultNetwork];
  const hasCommission = validatorDetails?.commission !== undefined;
  const isLiquid = stakingType === "liquid";

  const tokenRate = getTokenEquivalent({ val: coinAmountInput as string, network: network || defaultNetwork });

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem className={S.rewardInfo}>
          <InfoCard.TitleBox>
            <InfoCard.Title>Est. reward rate</InfoCard.Title>
            {hasInput && <RewardsTooltip amount={coinAmountInput} />}
          </InfoCard.TitleBox>
          <InfoCard.Content className={S.rewardInfoValue}>{networkReward?.rewards.percentage}%</InfoCard.Content>
        </InfoCard.StackItem>
        {isNative && hasInput && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {/* {stakeFees && (
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
        )} */}
        {hasCommission && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Commission rate</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{validatorDetails?.commission}%</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {hasInput &&
          (isLiquid ? (
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Will receive</InfoCard.Title>
              </InfoCard.TitleBox>
              <InfoCard.Content>{tokenRate}</InfoCard.Content>
            </InfoCard.StackItem>
          ) : (
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
          ))}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
