"use client";
import { useEffect, useMemo, useState } from "react";
import cn from "classnames";
import { useShell } from "../../../_contexts/ShellContext";
import { useStaking } from "../../../_contexts/StakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { defaultNetwork, networkCurrency } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { RewardsTooltip } from "../../_components/RewardsTooltip";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";
import { getFormattedCoinValue } from "@/app/_utils/conversions";
import { getPAleoDepositMintingAmountFromAleo } from "@/app/_services/aleo/utils";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";

import { LiquidStakeInfoAccordion } from "./LiquidStakeInfoAccordion";
import { NativeStakeInfoAccordion } from "./NativeStakeInfoAccordion";

import * as S from "./stake.css";

export const StakeInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useStaking();
  const networkReward = useNetworkReward({ amount: coinAmountInput });
  const { aleoToPAleoRate } = usePondoData() || {};
  const [isInfoAccordionOpen, setIsInfoAccordionOpen] = useState(false);

  const castedNetwork = network || defaultNetwork;
  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isLiquid = stakingType === "liquid";
  const isNative = stakingType === "native";

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

  useEffect(() => {
    !hasInput && setIsInfoAccordionOpen(false);
  }, [hasInput]);

  return (
    <div className={S.infoCardContainer}>
      <InfoCard.Card className={cn(S.infoCard({ state: hasInput ? "hasAccordion" : "default" }))}>
        <InfoCard.Stack>
          <InfoCard.StackItem className={S.rewardInfo}>
            <InfoCard.TitleBox>
              <InfoCard.Title>Est. reward rate</InfoCard.Title>
              {hasInput && <RewardsTooltip amount={coinAmountInput} />}
            </InfoCard.TitleBox>
            <InfoCard.Content className={S.rewardInfoValue}>{networkReward?.rewards.percentage}%</InfoCard.Content>
          </InfoCard.StackItem>
          {hasInput && isLiquid && !isInfoAccordionOpen && (
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

          {isInfoAccordionOpen && (isNative ? <NativeStakeInfoAccordion /> : <LiquidStakeInfoAccordion />)}
        </InfoCard.Stack>
      </InfoCard.Card>
      {hasInput && (
        <div className={S.accordionButtonContainer}>
          <button className={S.accordionButton} onClick={() => setIsInfoAccordionOpen(!isInfoAccordionOpen)}>
            <Icon
              className={cn(S.accordionButtonIcon({ state: isInfoAccordionOpen ? "open" : "default" }))}
              name="skip"
            />
          </button>
        </div>
      )}
    </div>
  );
};
