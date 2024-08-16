"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
// import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { feeRatioByNetwork, unstakingPeriodByNetwork, defaultNetwork, networkCurrency } from "../../../consts";
import type { StakingType } from "@/app/types";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useStakeValidatorState } from "@/app/_contexts/StakingContext/hooks";
// import { getStakeFees } from "@/app/_utils/transaction";
import { getTokenFromCoin } from "@/app/_utils/conversions";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";
import { getLiquidFees } from "@/app/_utils/transaction";

import * as S from "./stake.css";

export const StakeInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useStaking();
  const networkReward = useNetworkReward({ amount: coinAmountInput });
  const { validatorDetails } = useStakeValidatorState();

  // const stakeFees = getStakeFees({ amount: coinAmountInput, network: network || defaultNetwork });
  const liquidStakeFees = getLiquidFees({ amount: coinAmountInput || "0", type: "stake" });
  const formattedTotalFees = useDynamicAssetValueFromCoin({ coinVal: liquidStakeFees });
  const { mintRate } = usePondoData() || {};
  // const platformFee = feeRatioByNetwork[network || defaultNetwork] * 100;
  const castedNetwork = network || defaultNetwork;
  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const unstakingPeriod = unstakingPeriodByNetwork[castedNetwork][stakingType as StakingType];
  const hasCommission = validatorDetails?.commission !== undefined;
  const isLiquid = stakingType === "liquid";

  const tokenRate = getTokenFromCoin({ val: coinAmountInput || "0", network: castedNetwork, mintRate: mintRate || 1 });

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
        {hasInput && isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Total fees</InfoCard.Title>

              <Tooltip
                className={S.feesTooltip}
                trigger={<Icon name="info" />}
                content={
                  <>
                    Total fee <span className={S.plusSign}>=</span> network fee <span className={S.plusSign}>+</span>{" "}
                    protocol commission to Pondo.xyz
                  </>
                }
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
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

                <Tooltip
                  className={S.stakingTooltip}
                  trigger={<Icon name="info" />}
                  content={
                    <>
                      1 {networkCurrency[castedNetwork]} ={" "}
                      {getTokenFromCoin({ val: 1, network: castedNetwork, mintRate: mintRate || 1 })}
                    </>
                  }
                />
              </InfoCard.TitleBox>
              <InfoCard.Content>{tokenRate}</InfoCard.Content>
            </InfoCard.StackItem>
          ) : (
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Unstaking period</InfoCard.Title>

                <Tooltip
                  className={S.stakingTooltip}
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
