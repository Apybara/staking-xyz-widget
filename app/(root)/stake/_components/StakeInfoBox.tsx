"use client";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import {
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getFormattedCoinValue,
} from "../../../_utils/conversions";
import { feeRatioByNetwork, unstakingPeriodByNetwork } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

import * as S from "./stake.css";

export const StakeInfoBox = () => {
  const { currency, coinPrice, network } = useShell();
  const { stakeFees } = useStaking();

  const formatCoinValue = (val: string | number) => {
    const castedCurrency = currency || "USD";

    if (castedCurrency === "USD") {
      return getFormattedUSDPriceFromCoin({
        val,
        price: coinPrice?.[network || "celestia"]?.USD || 0,
      });
    }

    if (castedCurrency === "EUR") {
      return getFormattedEURPriceFromCoin({
        val,
        price: coinPrice?.[network || "celestia"]?.EUR || 0,
      });
    }

    return getFormattedCoinValue({ val: BigNumber(val).toNumber() });
  };

  const unstakingPeriod = unstakingPeriodByNetwork[network || "celestia"];

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Reward</InfoCard.Title>

            <Tooltip
              className={S.rewardsTooltip}
              variant="multilines"
              trigger={<Icon name="info" />}
              title="Estimated rewards"
              content={
                <ul className={S.rewardsList}>
                  <li className={S.rewardsItem}>
                    <span className={S.rewardsInterval}>Daily</span>
                    <span className={S.rewardsValue}>{formatCoinValue(1)}</span>
                  </li>
                  <li className={S.rewardsItem}>
                    <span className={S.rewardsInterval}>Monthly</span>
                    <span className={S.rewardsValue}>{formatCoinValue(10)}</span>
                  </li>
                  <li className={S.rewardsItem}>
                    <span className={S.rewardsInterval}>Yearly</span>
                    <span className={S.rewardsValue}>{formatCoinValue(100)}</span>
                  </li>
                </ul>
              }
            />
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
                    Network fee <span className={S.plusSign}>+</span> Platform fee (
                    {feeRatioByNetwork[network || "celestia"]}%)
                  </>
                }
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{formatCoinValue(stakeFees)}</InfoCard.Content>
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
