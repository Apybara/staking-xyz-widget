"use client";
import type { Network } from "../../../types";
import type { ActivityItem } from "../../../_services/stakingOperator/types";
import { useShell } from "../../../_contexts/ShellContext";
import { Skeleton } from "../../../_components/Skeleton";
import * as ListTable from "../../../_components/ListTable";
import { EmptyState } from "../../../_components/EmptyState";
import { ErrorRetryModule } from "../../../_components/ErrorRetryModule";
import { getPercentagedNumber } from "../../../_utils/number";
import { getUTCStringFromUnixTimestamp } from "../../../_utils/time";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { useActivity } from "../../../_services/stakingOperator/hooks";
import { networkExplorer, defaultNetwork } from "../../../consts";
import * as S from "./activity.css";

export const ActivityTable = () => {
  const { network } = useShell();
  const { params, query } = useActivity() || {};
  const { offset, setOffset, limit, filterKey, setFilterKey } = params;
  const { formattedEntries, isFetching, error, disableNextPage, lastOffset, refetch } = query || {};

  if (isFetching) {
    return (
      <>
        <Skeleton width="100%" height={26} />
        <ListTable.Pad>
          {[...Array(limit)].map((_, index) => (
            <Skeleton key={`activity-skeleton-${index}`} width="100%" height={36} />
          ))}
          <Skeleton width={100} height={18} />
        </ListTable.Pad>
      </>
    );
  }

  if (error) {
    return (
      <ListTable.Pad className={S.errorPad}>
        <ErrorRetryModule onRetry={refetch} isLoading={isFetching} />
      </ListTable.Pad>
    );
  }

  return (
    <>
      <ListTable.Tabs
        tabs={[
          {
            children: "All",
            state: filterKey === null ? "highlighted" : "default",
            onClick: () => setFilterKey(null),
          },
          {
            children: "Stake",
            state: filterKey === "stake" ? "highlighted" : "default",
            onClick: () => setFilterKey("stake"),
          },
          {
            children: "Unstake",
            state: filterKey === "unstake" ? "highlighted" : "default",
            onClick: () => setFilterKey("unstake"),
          },
        ]}
      />
      {formattedEntries?.length ? (
        <ListTable.Pad>
          <ListTable.List>
            {formattedEntries?.map((activity, index) => (
              <ListItem key={index + activity.id} activity={activity} network={network} />
            ))}
          </ListTable.List>
          <ListTable.Pagination
            currentPage={offset + 1}
            hasNextPage={!disableNextPage}
            onNextClick={() => setOffset(offset + 1)}
            onPrevClick={() => setOffset(offset - 1)}
            onFirstClick={() => setOffset(0)}
            onLastClick={() => lastOffset && setOffset(lastOffset)}
          />
        </ListTable.Pad>
      ) : (
        <ListTable.Pad className={S.errorPad}>
          <EmptyState />
        </ListTable.Pad>
      )}
    </>
  );
};

const ListItem = ({
  activity,
  network,
}: {
  activity: Omit<ActivityItem, "amount"> & { amount: string };
  network: Network | null;
}) => {
  const amount = useDynamicAssetValueFromCoin({ coinVal: activity.amount });
  const href = `${networkExplorer[network || defaultNetwork]}tx/${activity.id}`;

  return (
    <ListTable.Item>
      <ListTable.ExternalLinkItemWrapper href={activity.id ? href : undefined}>
        <ListTable.TxInfoPrimary
          title={titleKey[activity.type]}
          externalLink={!!activity.id}
          amount={amount || "－"}
          isProcessing={activity.inProgress}
        />
        <ListTable.TxInfoSecondary
          time={getUTCStringFromUnixTimestamp(activity.timestamp)}
          reward={`Reward ${getPercentagedNumber(activity.rewardRate)}`}
          isProcessing={activity.inProgress}
        />
      </ListTable.ExternalLinkItemWrapper>
    </ListTable.Item>
  );
};

const titleKey = {
  stake: "Stake",
  unstake: "Unstake",
};
