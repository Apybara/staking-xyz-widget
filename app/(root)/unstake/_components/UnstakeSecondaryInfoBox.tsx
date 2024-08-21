"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useUnstaking } from "../../../_contexts/UnstakingContext";
import * as InfoCard from "../../../_components/InfoCard";
import { unstakingPeriodByNetwork, defaultNetwork } from "../../../consts";
import type { StakingType } from "@/app/types";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import Switch from "@/app/_components/Switch";

import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { getFormattedAleoFromPAleo } from "@/app/_services/aleo/utils";
import { getLiquidTotalFees } from "@/app/_utils/transaction";
import { usePondoData } from "@/app/_services/aleo/pondo/hooks";

import * as S from "./unstake.css";

export const UnstakeSecondaryInfoBox = () => {
  const { network, stakingType } = useShell();
  const { coinAmountInput, instantWithdrawal, setStates } = useUnstaking();

  const { pAleoToAleoRate } = usePondoData() || {};
  const liquidUnstakeFees = getLiquidTotalFees({
    amount: coinAmountInput || "0",
    type: instantWithdrawal ? "instant_unstake" : "unstake",
    pAleoToAleoRate: pAleoToAleoRate || 1,
  });
  const formattedTotalFees = useDynamicAssetValueFromCoin({ coinVal: liquidUnstakeFees });

  const hasInput = coinAmountInput !== "" && coinAmountInput !== "0";
  const isNative = stakingType === "native";
  const isLiquid = stakingType === "liquid";

  if (!hasInput) return null;

  return (
    <InfoCard.Card>
      <InfoCard.Stack>
        {hasInput && isNative && (
          <InfoCard.StackItem>
            <InfoCard.TitleBox>
              <InfoCard.Title>Transaction fee</InfoCard.Title>
            </InfoCard.TitleBox>
            <InfoCard.Content>{formattedTotalFees}</InfoCard.Content>
          </InfoCard.StackItem>
        )}
        {isLiquid && (
          <>
            <InfoCard.StackItem>
              <InfoCard.TitleBox>
                <InfoCard.Title>Instant withdrawal</InfoCard.Title>

                <Tooltip
                  className={S.unstakingTooltip}
                  trigger={<Icon name="info" />}
                  content="Instant withdrawals have a fee of 0.25%. They will be processed immediately without any waiting period."
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
                          Instant withdrawal fee <span className={S.plusSign}>+</span>{" "}
                        </>
                      )}
                      Network fee <span className={S.plusSign}>+</span> Pondo fee
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
