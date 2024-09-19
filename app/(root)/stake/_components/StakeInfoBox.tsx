"use client";
import { useMemo } from "react";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork, networkCurrency, aleoFees } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { useStakeValidatorState } from "@/app/_contexts/StakingContext/hooks";
import { getFormattedCoinValue } from "@/app/_utils/conversions";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import {
  getIsAleoNetwork,
  getMicroCreditsToCredits,
  getPAleoDepositMintingAmountFromAleo,
} from "@/app/_services/aleo/utils";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";

import * as S from "./stake.css";

export const StakeInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useStaking();
  const networkReward = useNetworkReward({ amount: coinAmountInput });
  const { validatorDetails } = useStakeValidatorState();
  const { aleoToPAleoRate } = usePondoData() || {};

  const castedNetwork = network || defaultNetwork;
  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const unstakingPeriod = unstakingPeriodByNetwork[castedNetwork][stakingType || "native"];
  const hasCommission = validatorDetails?.commission !== undefined;
  const isAleo = getIsAleoNetwork(network);
  const isLiquid = stakingType === "liquid";
  const aleoTxFee = useDynamicAssetValueFromCoin({
    coinVal: getMicroCreditsToCredits(aleoFees.stake[stakingType || "native"]),
  });

  const fixedAleoToPAleoAmount = useMemo(() => {
    const val = getPAleoDepositMintingAmountFromAleo({
      aleoCredits: 1,
      aleoToPAleoRate: aleoToPAleoRate || 1,
    }).pAleoCreditsAmount;
    return getFormattedCoinValue({
      val,
      formatOptions: {
        currencySymbol: "pALEO",
      },
    });
  }, [aleoToPAleoRate]);

  const receivableAleoToPAleoAmount = useMemo(() => {
    const val = getPAleoDepositMintingAmountFromAleo({
      aleoCredits: coinAmountInput || 0,
      aleoToPAleoRate: aleoToPAleoRate || 1,
    }).pAleoCreditsAmount;
    return getFormattedCoinValue({
      val,
      formatOptions: {
        currencySymbol: "pALEO",
      },
    });
  }, [coinAmountInput, aleoToPAleoRate]);

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
        {hasInput && isAleo && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{aleoTxFee}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {hasInput && isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Pondo fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>10% of rewards</InfoCard.Content>
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
        {hasInput && isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Will receive</InfoCard.Title>

              <Tooltip
                className={S.stakingTooltip}
                trigger={<Icon name="info" />}
                content={
                  <>
                    1 {networkCurrency[castedNetwork]} = {fixedAleoToPAleoAmount}
                  </>
                }
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{receivableAleoToPAleoAmount}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {hasInput && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Unstaking period</InfoCard.Title>

              <Tooltip
                className={S.stakingTooltip}
                trigger={<Icon name="info" />}
                content={<>It takes ~{unstakingPeriod} for unstaking to be completed.</>}
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>~{unstakingPeriod}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
