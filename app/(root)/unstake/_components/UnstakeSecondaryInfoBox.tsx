"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork } from "../../../consts";

export const UnstakeSecondaryInfoBox = () => {
  const { network } = useShell();
  const { coinAmountInput } = useUnstaking();

  if (coinAmountInput === "" || coinAmountInput === "0") {
    return null;
  }

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
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
