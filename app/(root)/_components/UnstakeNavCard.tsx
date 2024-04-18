"use client";
import { useMemo } from "react";
import { useWallet } from "../../_contexts/WalletContext";
import { useUnbondingDelegations, useStakedBalance } from "../../_services/unstake/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const { stakedBalance } = useStakedBalance() || {};
  const unbondingDelegations = useUnbondingDelegations();

  const isDisabled = connectionStatus !== "connected" || !stakedBalance || stakedBalance === "0";

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
      return {
        title: <NavCard.SecondaryText>In progress {unbondingDelegations.formatted.length}</NavCard.SecondaryText>,
        value: (
          <NavCard.PrimaryText>
            {unbondingDelegations.formatted[0].remainingDays}
            <NavCard.SecondaryText> days left</NavCard.SecondaryText>
          </NavCard.PrimaryText>
        ),
      };
    }
  }, [connectionStatus, unbondingDelegations]);

  return <NavCard.Card {...props} page="unstake" disabled={isDisabled} endBox={endBoxValue} />;
};
