"use client";
import { useMemo } from "react";
import numbro from "numbro";
import { fromUnixTime } from "date-fns";
import { useWallet } from "../../_contexts/WalletContext";
import { useActivity, useLastOffsetActivity } from "../../_services/stakingOperator/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";
import { getTimeUnitStrings, getTimeDiffInSingleUnits } from "../../_utils/time";

export const ActivityNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const activity = useActivity(null);
  const { data, totalEntries, isLoading } =
    useLastOffsetActivity({
      limit: activity?.params.limit,
      filterKey: activity?.params.filterKey,
      lastOffset: activity?.query?.lastOffset || 0,
    }) || {};

  const isDisabled = connectionStatus !== "connected" || data?.entries?.length === 0;
  const lastData = data?.entries?.[data?.entries.length - 1];

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
    if (lastData) {
      const timeUnits = getTimeDiffInSingleUnits(fromUnixTime(lastData.timestamp));
      const times = timeUnits && getTimeUnitStrings(timeUnits);
      return {
        title: (
          <NavCard.SecondaryText>
            For {numbro(times?.time).format({ thousandSeparated: true })} {times?.unit}
          </NavCard.SecondaryText>
        ),
        value: (
          <NavCard.PrimaryText>
            {totalEntries}
            <NavCard.SecondaryText> actions</NavCard.SecondaryText>
          </NavCard.PrimaryText>
        ),
      };
    }
  }, [connectionStatus, totalEntries, lastData, isLoading]);

  return <NavCard.Card {...props} page="activity" disabled={isDisabled} endBox={endBoxValue} />;
};
