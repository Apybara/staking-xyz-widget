"use client";
import { useMemo } from "react";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork, networkTokens } from "../../../consts";
import type { StakingType } from "@/app/types";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import Switch from "@/app/_components/Switch";

import { getMicroCreditsToCredits } from "@/app/_services/aleo/utils";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { getCoinFromToken } from "@/app/_utils/conversions";
import { getInstantWithdrawalFee } from "@/app/_services/aleo/utils";

import * as S from "./unstake.css";

export const UnstakeSecondaryInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput, instantWithdrawal, setStates } = useUnstaking();
  const txFee = "0.3456"; // dummy sum of network fee + blended commission + protocal commission
  const totalFees = instantWithdrawal ? getInstantWithdrawalFee(coinAmountInput || "0", txFee) : txFee;
  const formattedTotalFees = useDynamicAssetValueFromCoin({ coinVal: totalFees });

  const castedNetwork = network || defaultNetwork;

  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isNative = stakingType === "native";
  const isLiquid = stakingType === "liquid";

  if (!hasInput) return null;

  const tokenRate = getCoinFromToken({ val: coinAmountInput as string, network: castedNetwork });

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        <InfoCard.StackItem>
          {isNative && hasInput && (
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
          )}
          <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
        </InfoCard.StackItem>
        {isLiquid && (
          <>
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Instant withdrawal</InfoCard.Title>

                <Tooltip
                  className={S.unstakingTooltip}
                  trigger={<Icon name="info" />}
                  content="Instant withdrawals have a fee of 0.25%."
                />
              </InfoCard.TitleBox>
              <InfoCard.Content>
                <Switch onChange={(checked) => setStates({ instantWithdrawal: checked })} />
              </InfoCard.Content>
            </InfoCard.StackItem>

            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Total fees</InfoCard.Title>

                <Tooltip
                  className={S.unstakingTooltip}
                  trigger={<Icon name="info" />}
                  content={
                    <>
                      Total fee <span className={S.plusSign}>=</span>{" "}
                      {!!instantWithdrawal && (
                        <>
                          instant withdrawals fee <span className={S.plusSign}>+</span>{" "}
                        </>
                      )}
                      network fee <span className={S.plusSign}>+</span> blended commission to validators{" "}
                      <span className={S.plusSign}>+</span> protocol commission to Pondo.xyz
                    </>
                  }
                />
              </InfoCard.TitleBox>
              <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
            </InfoCard.StackItem>
          </>
        )}
        <InfoCard.StackItem>
          <InfoCard.TitleBox>
            <InfoCard.Title>Unstaking period</InfoCard.Title>
          </InfoCard.TitleBox>
          <InfoCard.Content>
            {instantWithdrawal
              ? "Instant"
              : unstakingPeriodByNetwork[network || defaultNetwork][stakingType as StakingType]}
          </InfoCard.Content>
        </InfoCard.StackItem>
        {hasInput && isLiquid && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Will return</InfoCard.Title>

              <Tooltip
                className={S.unstakingTooltip}
                trigger={<Icon name="info" />}
                content={
                  <>
                    1 {networkTokens[castedNetwork]} = {getCoinFromToken({ val: 1, network: castedNetwork })}
                  </>
                }
              />
            </InfoCard.TitleBox>
            <InfoCard.Content>{tokenRate}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
      </InfoCard.Stack>
    </InfoCard.Card>
  );
};
