"use client";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { getFormattedCoinPrice, getFormattedTokenValue } from "../../../_utils/conversions";
import { unstakingPeriodByNetwork } from "../../../consts";
import { rewardInfoValue } from "./stake.css";

export const StakeInfoBox = () => {
  const { currency, coinPrice, network } = useShell();
  const { denomStakeFees } = useStaking();

  const fees = useMemo(() => {
    if (!denomStakeFees) return undefined;
    const castedCurrency = currency || "USD";

    if (castedCurrency === "USD" || castedCurrency === "EUR") {
      const price = coinPrice?.[network || "celestia"]?.[castedCurrency] || 0;
      return getFormattedCoinPrice({
        val: denomStakeFees,
        price,
        currency: castedCurrency,
        options: {
          formatOptions: {
            currencySymbol: castedCurrency === "USD" ? "$" : "€",
          },
        },
      });
    }
    return getFormattedTokenValue({ val: BigNumber(denomStakeFees).toNumber() });
  }, [denomStakeFees]);

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
