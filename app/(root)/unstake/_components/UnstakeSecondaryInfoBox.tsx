"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork, aleoDefaultUnstakeFee } from "../../../consts";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { getMicroCreditsToCredits } from "@/app/_services/aleo/utils";

export const UnstakeSecondaryInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput } = useUnstaking();

  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isNative = stakingType === "native";
  const formattedTotalFees = useDynamicAssetValueFromCoin({ coinVal: getMicroCreditsToCredits(aleoDefaultUnstakeFee) });

  if (coinAmountInput === "" || coinAmountInput === "0") {
    return null;
  }

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        {isNative && hasInput && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Unstaking period</InfoCard.Title>
          </InfoCard.TitleBox>
          <InfoCard.Content>{unstakingPeriodByNetwork[network || defaultNetwork]}</InfoCard.Content>
        </InfoCard.StackItem>
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
