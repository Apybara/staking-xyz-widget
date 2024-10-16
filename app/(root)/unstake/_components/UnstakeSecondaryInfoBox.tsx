"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork } from "../../../consts";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { getFormattedAleoFromPAleo } from "@/app/_services/aleo/utils";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";
import { getIsAleoNetwork, getAleoTotalUnstakeFees } from "@/app/_services/aleo/utils";

import * as S from "./unstake.css";

export const UnstakeSecondaryInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput, instantWithdrawal } = useUnstaking();
  const { pAleoToAleoRate } = usePondoData() || {};

  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isAleo = getIsAleoNetwork(network);
  const isLiquid = stakingType === "liquid";
  const aleoTotalFees = getAleoTotalUnstakeFees({
    amount: coinAmountInput || "0",
    stakingType: stakingType || "native",
    isInstant: instantWithdrawal || false,
    pAleoToAleoRate,
  });
  const formattedAleoTotalFees = useDynamicAssetValueFromCoin({ coinVal: aleoTotalFees });

  if (!hasInput) return null;

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        {isAleo && isLiquid && (
          <>
            {!instantWithdrawal ? (
              <InfoCard.StackItem>
                <InfoCard.TitleBox>
                  <InfoCard.Title>Transaction fee</InfoCard.Title>
                </InfoCard.TitleBox>
                <InfoCard.Content>{formattedAleoTotalFees}</InfoCard.Content>
              </InfoCard.StackItem>
            ) : (
              <InfoCard.StackItem>
                <InfoCard.TitleBox>
                  <InfoCard.Title>Total fees</InfoCard.Title>

                  <Tooltip
                    className={S.unstakingTooltip}
                    trigger={<Icon name="info" />}
                    content={
                      <>
                        Total fees <span className={S.plusSign}>=</span>{" "}
                        {!!instantWithdrawal && (
                          <>
                            Instant withdrawal fee <span className={S.plusSign}>+</span>{" "}
                          </>
                        )}
                        Transaction fee
                      </>
                    }
                  />
                </InfoCard.TitleBox>
                <InfoCard.Content>{formattedAleoTotalFees}</InfoCard.Content>
              </InfoCard.StackItem>
            )}
          </>
        )}
        {isAleo && !isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedAleoTotalFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Unstaking period</InfoCard.Title>
          </InfoCard.TitleBox>
          <InfoCard.Content>
            {instantWithdrawal
              ? "Instant"
              : `~${unstakingPeriodByNetwork[network || defaultNetwork][stakingType || "native"]}`}
          </InfoCard.Content>
        </InfoCard.StackItem>
        {isAleo && isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Will return</InfoCard.Title>

              <Tooltip
                className={S.unstakingTooltip}
                trigger={<Icon name="info" />}
                content={<>1 pALEO = {getFormattedAleoFromPAleo({ val: 1, pAleoToAleoRate: pAleoToAleoRate || 1 })}</>}
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>
              {getFormattedAleoFromPAleo({ val: coinAmountInput as string, pAleoToAleoRate: pAleoToAleoRate || 1 })}
            </InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
