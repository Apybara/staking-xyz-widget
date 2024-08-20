"use client";
import { useMemo } from "react";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useUnbondingDelegations, useStakedBalance } from "../../../_services/stakingOperator/hooks";
import { useAleoAddressUnbondingStatus, usePAleoBalanceByAddress } from "../../../_services/aleo/hooks";
import * as NavCard from "../NavCard";
import { Skeleton } from "../../../_components/Skeleton";
import type { StakingType } from "@/app/types";
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
  const pAleoStakedBalanceQuery = usePAleoBalanceByAddress({ address: address || undefined, network });

  const fallbackTime = useFallbackTime();
  const showOneEntryOnly = aleoUnstakeStatus !== null;
  const hasPendingItems = unbondingDelegations?.length || showOneEntryOnly;
  const totalPendingItems = showOneEntryOnly ? 1 : unbondingDelegations?.length || 0;
  const completionTime = aleoUnstakeStatus?.completionTime || unbondingDelegations?.[0]?.completionTime;
  const defaultTitle = useDefaultTitle({ showOneEntryOnly, unbondingDelegationsLength: unbondingDelegations?.length });

  const isDisabled = useMemo(() => {
    if (connectionStatus !== "connected") return true;
    if (network === "aleo" && pAleoStakedBalanceQuery.stakedBalance !== "0") return false;
    return (!stakedBalance || stakedBalance === "0") && !hasPendingItems;
  }, [connectionStatus, network, pAleoStakedBalanceQuery.stakedBalance, stakedBalance, hasPendingItems]);

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

      return aleoUnstakeStatus?.isWithdrawable
        ? {
            title: <NavCard.SecondaryText>Withdrawable</NavCard.SecondaryText>,
            value: <NavCard.PrimaryText>{aleoUnbondingAmount}</NavCard.PrimaryText>,
          }
        : {
            title: defaultTitle,
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
    defaultTitle,
  ]);

  return <NavCard.Card {...props} page="unstake" disabled={isDisabled} endBox={endBoxValue} />;
};

const useDefaultTitle = ({
  showOneEntryOnly,
  unbondingDelegationsLength,
}: {
  showOneEntryOnly: boolean;
  unbondingDelegationsLength?: number;
}) => {
  if (showOneEntryOnly) {
    return (
      <NavCard.SecondaryText className={S.pendingText}>
        Pending <span className={S.pendingStatus}></span>
      </NavCard.SecondaryText>
    );
  }
  return <NavCard.SecondaryText>In progress {unbondingDelegationsLength}</NavCard.SecondaryText>;
};

const useFallbackTime = () => {
  const { network, stakingType } = useShell();
  const fallbackTime = unstakingPeriodByNetwork[network || defaultNetwork][stakingType as StakingType];

  return {
    time: fallbackTime?.split(" ")[0],
    unit: fallbackTime?.split(" ")[1],
  };
};
