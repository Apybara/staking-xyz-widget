"use client";
import { useStaking } from "@/app/_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

import { useShell } from "@/app/_contexts/ShellContext";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import {
  getIsAleoNetwork,
  getMicroCreditsToCredits,
  getPAleoDepositMintingAmountFromAleo,
} from "@/app/_services/aleo/utils";
import { aleoFees, defaultNetwork, networkCurrency, unstakingPeriodByNetwork } from "@/app/consts";

import * as S from "./stake.css";
import { useMemo } from "react";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";
import { getFormattedCoinValue } from "@/app/_utils/conversions";

export const LiquidStakeInfoAccordion = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useStaking();
  const { aleoToPAleoRate } = usePondoData() || {};

  const castedNetwork = network || defaultNetwork;
  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const unstakingPeriod = unstakingPeriodByNetwork[castedNetwork][stakingType || "native"];
  const isLiquid = stakingType === "liquid";
  const isAleo = getIsAleoNetwork(network);
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
    <InfoCard.Stack>
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
  );
};
