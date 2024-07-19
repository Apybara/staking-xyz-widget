"use client";
import { useMemo } from "react";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnbondingDelegations, useStakedBalance } from "../../../_services/stakingOperator/hooks";
import { useAleoAddressUnbondingStatus } from "../../../_services/aleo/hooks";
import * as NavCard from "../NavCard";
import Tooltip from "../../../_components/Tooltip";
import { Skeleton } from "../../../_components/Skeleton";
import { getTimeUnitStrings } from "../../../_utils/time";
import { getDynamicAssetValueFromCoin } from "../../../_utils/conversions";
import { unstakingPeriodByNetwork, defaultNetwork } from "../../../consts";
import * as S from "./unstakeNavCard.css";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { network, currency, coinPrice } = useShell();
  const { connectionStatus, address } = useWallet();
  const { stakedBalance } = useStakedBalance() || {};
  const { data: unbondingDelegations, isLoading } = useUnbondingDelegations() || {};
  const aleoUnstakeStatus = useAleoAddressUnbondingStatus({
    address: address || undefined,
    network,
  });

  const fallbackTime = useFallbackTime();
  const showOneEntryOnly = aleoUnstakeStatus !== null;
  const hasPendingItems = unbondingDelegations?.length || showOneEntryOnly;
  const totalPendingItems = showOneEntryOnly ? 1 : unbondingDelegations?.length || 0;
  const isDisabled =
    connectionStatus !== "connected" || ((!stakedBalance || stakedBalance === "0") && !hasPendingItems);
  const completionTime = aleoUnstakeStatus?.completionTime || unbondingDelegations?.[0]?.completionTime;

  const isClaimable = aleoUnstakeStatus?.isClaimable;

  const endBoxValue = useMemo(() => {
    if (connectionStatus !== "connected") return undefined;

    if (isLoading) {
      return {
        title: (
          <NavCard.SecondaryText>
            <Skeleton width={68} height={12} />
          </NavCard.SecondaryText>
        ),
        value: (
          <NavCard.PrimaryText>
            <Skeleton width={82} height={16} />
          </NavCard.PrimaryText>
        ),
      };
    }
    if (hasPendingItems) {
      const times = completionTime && getTimeUnitStrings(completionTime);
      const aleoUnbondingAmount = getDynamicAssetValueFromCoin({
        currency,
        coinPrice,
        network,
        coinVal: aleoUnstakeStatus?.amount,
      });

      return aleoUnstakeStatus?.isClaimable
        ? {
            title: <NavCard.SecondaryText>Claimable</NavCard.SecondaryText>,
            value: <NavCard.PrimaryText>{aleoUnbondingAmount}</NavCard.PrimaryText>,
          }
        : {
            title: (
              <NavCard.SecondaryText className={S.pendingText}>
                Pending <span className={S.pendingStatus}></span>
              </NavCard.SecondaryText>
            ),
            value: (
              <NavCard.PrimaryText>
                {times?.time || fallbackTime.time}{" "}
                <NavCard.SecondaryText>{times?.unit || fallbackTime.unit} left</NavCard.SecondaryText>
              </NavCard.PrimaryText>
            ),
          };
    }
  }, [
    connectionStatus,
    unbondingDelegations,
    isLoading,
    totalPendingItems,
    completionTime,
    showOneEntryOnly,
    aleoUnstakeStatus,
  ]);

  return <NavCard.Card {...props} page="unstake" disabled={isDisabled} endBox={endBoxValue} />;
};

const useFallbackTime = () => {
  const { network } = useShell();
  const fallbackTime = unstakingPeriodByNetwork[network || defaultNetwork];

  return {
    time: fallbackTime.split(" ")[0],
    unit: fallbackTime.split(" ")[1],
  };
};
