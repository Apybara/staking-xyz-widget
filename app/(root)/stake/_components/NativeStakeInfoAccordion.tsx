"use client";

import * as InfoCard from "../../../_components/InfoCard";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

import { useShell } from "@/app/_contexts/ShellContext";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { getIsAleoNetwork, getMicroCreditsToCredits } from "@/app/_services/aleo/utils";
import { aleoFees, defaultNetwork, unstakingPeriodByNetwork } from "@/app/consts";
import { useStakeValidatorState } from "@/app/_contexts/StakingContext/hooks";

import * as S from "./stake.css";

export const NativeStakeInfoAccordion = () => {
  const { network, stakingType } = useShell();
  const { validatorDetails } = useStakeValidatorState();

  const castedNetwork = network || defaultNetwork;
  const unstakingPeriod = unstakingPeriodByNetwork[castedNetwork][stakingType || "native"];
  const hasCommission = validatorDetails?.commission !== undefined;
  const isAleo = getIsAleoNetwork(network);
  const aleoTxFee = useDynamicAssetValueFromCoin({
    coinVal: getMicroCreditsToCredits(aleoFees.stake[stakingType || "native"]),
  });

  return (
    <InfoCard.Stack>
      {isAleo && (
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Transaction fee</InfoCard.Title>
          </InfoCard.TitleBox>
          <InfoCard.Content>{aleoTxFee}</InfoCard.Content>
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
    </InfoCard.Stack>
  );
};
