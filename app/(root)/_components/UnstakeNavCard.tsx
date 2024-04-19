"use client";
import { useMemo } from "react";
import { useWallet } from "../../_contexts/WalletContext";
import { useUnbondingDelegations, useStakedBalance } from "../../_services/stakingOperator/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";
import { getTimeUnitStrings } from "../../_utils/time";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const { stakedBalance } = useStakedBalance() || {};
  const unbondingDelegations = useUnbondingDelegations();

  const isDisabled =
    connectionStatus !== "connected" ||
    !!unbondingDelegations?.error ||
    unbondingDelegations?.isLoading ||
    stakedBalance === "0";

  const endBoxValue = useMemo(() => {
    if (connectionStatus !== "connected") return undefined;

    if (unbondingDelegations?.isLoading) {
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
    if (unbondingDelegations?.formatted?.length) {
      const times =
        unbondingDelegations.formatted[0].remainingTime &&
        getTimeUnitStrings(unbondingDelegations.formatted[0].remainingTime);

      return {
        title: <NavCard.SecondaryText>In progress {unbondingDelegations.formatted.length}</NavCard.SecondaryText>,
        value: (
          <NavCard.PrimaryText>
            {times?.time} <NavCard.SecondaryText>{times?.unit} left</NavCard.SecondaryText>
          </NavCard.PrimaryText>
        ),
      };
    }
  }, [connectionStatus, unbondingDelegations]);

  return <NavCard.Card {...props} page="unstake" disabled={isDisabled} endBox={endBoxValue} />;
};
