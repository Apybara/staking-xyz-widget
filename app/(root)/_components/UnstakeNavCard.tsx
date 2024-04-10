"use client";
import { useMemo } from "react";
import { useWallet } from "../../_contexts/WalletContext";
import { Skeleton } from "../../_components/Skeleton";
import { useUnbondingDelegations } from "../../_services/unstake/hooks";
import * as NavCard from "../_components/NavCard";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const unbondingDelegations = useUnbondingDelegations();

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

  return <NavCard.Card {...props} page="unstake" disabled={connectionStatus !== "connected"} endBox={endBoxValue} />;
};
