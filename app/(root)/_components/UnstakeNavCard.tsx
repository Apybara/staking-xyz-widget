"use client";
import { useMemo } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useUnbondingDelegations, useStakedBalance } from "../../_services/stakingOperator/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";
import { getTimeUnitStrings } from "../../_utils/time";
import { unstakingPeriodByNetwork, defaultNetwork } from "../../consts";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const { stakedBalance } = useStakedBalance() || {};
  const { data: unbondingDelegations, isLoading } = useUnbondingDelegations() || {};
  const fallbackTime = useFallbackTime();

  const isDisabled =
    connectionStatus !== "connected" || ((!stakedBalance || stakedBalance === "0") && !unbondingDelegations?.length);

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
    if (unbondingDelegations?.length) {
      const times =
        unbondingDelegations[0].completionTime && getTimeUnitStrings(unbondingDelegations[0].completionTime);

      return {
        title: <NavCard.SecondaryText>In progress {unbondingDelegations.length}</NavCard.SecondaryText>,
        value: (
          <NavCard.PrimaryText>
            {times?.time || fallbackTime.time}{" "}
            <NavCard.SecondaryText>{times?.unit || fallbackTime.unit} left</NavCard.SecondaryText>
          </NavCard.PrimaryText>
        ),
      };
    }
  }, [connectionStatus, unbondingDelegations, isLoading]);

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
