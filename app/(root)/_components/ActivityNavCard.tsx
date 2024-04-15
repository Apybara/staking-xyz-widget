"use client";
import { useMemo } from "react";
import moment from "moment";
import { useWallet } from "../../_contexts/WalletContext";
import { useActivity, useLastOffsetActivity } from "../../_services/stakingOperator/hooks";
import * as NavCard from "../_components/NavCard";
import { Skeleton } from "../../_components/Skeleton";

export const ActivityNavCard = (props: NavCard.PageNavCardProps) => {
  const { connectionStatus } = useWallet();
  const activity = useActivity();
  const { data, totalEntries, isLoading } = useLastOffsetActivity({ ...activity.params });

  const isDisabled = connectionStatus !== "connected" || data?.length === 0;
  const lastData = data?.[data.length - 1];

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
      return {
        title: (
          <NavCard.SecondaryText>
            For {moment(moment.now()).diff(lastData.timestamp, "days")} days
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
