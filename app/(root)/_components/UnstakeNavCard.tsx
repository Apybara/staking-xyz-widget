"use client";
import { useMemo } from "react";
import { useWallet } from "../../_contexts/WalletContext";
import { useActivity, useStakedBalance } from "../../_services/stakingOperator/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";
import { getTimeUnitStrings } from "../../_utils/time";

export const UnstakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const { stakedBalance } = useStakedBalance() || {};
  const { query: unstakeActivityQuery } =
    useActivity({
      filterKey: "transactions_unstake",
      offset: 0,
      limit: 1,
    }) || {};
  const { formattedEntries, totalEntries, isLoading, error } = unstakeActivityQuery || {};
  const inProgressEntries = formattedEntries?.filter((item) => !!item.completionTime);

  const isDisabled =
    connectionStatus !== "connected" ||
    !!error ||
    isLoading ||
    (stakedBalance === "0" && (!inProgressEntries?.length || totalEntries === 0));

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
    if (inProgressEntries?.length && totalEntries) {
      const times = inProgressEntries[0].completionTime && getTimeUnitStrings(inProgressEntries[0].completionTime);

      return {
        title: <NavCard.SecondaryText>In progress {totalEntries}</NavCard.SecondaryText>,
        value: (
          <NavCard.PrimaryText>
            {times?.time} <NavCard.SecondaryText>{times?.unit} left</NavCard.SecondaryText>
          </NavCard.PrimaryText>
        ),
      };
    }
  }, [connectionStatus, totalEntries, inProgressEntries, isLoading]);

  return <NavCard.Card {...props} page="unstake" disabled={isDisabled} endBox={endBoxValue} />;
};
