"use client";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import {
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getFormattedCoinValue,
} from "../../../_utils/conversions";
import { unstakingPeriodByNetwork } from "../../../consts";
import { rewardInfoValue } from "./stake.css";

export const StakeInfoBox = () => {
  const { currency, coinPrice, network } = useShell();
  const { stakeFees } = useStaking();

  const fees = useMemo(() => {
    if (!stakeFees) return undefined;
    const castedCurrency = currency || "USD";

    if (castedCurrency === "USD") {
      return getFormattedUSDPriceFromCoin({
        val: stakeFees,
        price: coinPrice?.[network || "celestia"]?.USD || 0,
      });
    }
    if (castedCurrency === "EUR") {
      return getFormattedEURPriceFromCoin({
        val: stakeFees,
        price: coinPrice?.[network || "celestia"]?.EUR || 0,
      });
    }
    return getFormattedCoinValue({ val: BigNumber(stakeFees).toNumber() });
  }, [stakeFees]);

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Reward</InfoCard.Title>
          </InfoCard.TitleBox>
          <InfoCard.Content className={rewardInfoValue}>00.00%</InfoCard.Content>
        </InfoCard.StackItem>
        {fees && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Total fees</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{fees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {fees && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Unstaking period</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{unstakingPeriodByNetwork[network || "celestia"]}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
