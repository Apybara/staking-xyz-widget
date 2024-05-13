"use client";
import type { Network } from "../../../../types";
import type { RewardsHistoryItem } from "../../../../_services/stakingOperator/types";
import { useShell } from "../../../../_contexts/ShellContext";
import { Skeleton } from "../../../../_components/Skeleton";
import * as ListTable from "../../../../_components/ListTable";
import { EmptyState } from "../../../../_components/EmptyState";
import { ErrorRetryModule } from "../../../../_components/ErrorRetryModule";
import { getPercentagedNumber } from "../../../../_utils/number";
import { getUTCStringFromUnixTimestamp, getUTCStringFromUnixTimeString } from "../../../../_utils/time";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useRewardsHistory } from "../../../../_services/stakingOperator/hooks";
import { networkExplorer, defaultNetwork } from "../../../../consts";
import * as S from "./historyTable.css";
import { WidgetContent } from "@/app/_components/WidgetContent";

export const RewardsHistoryTable = () => {
  const { network } = useShell();
  const { params, query } = useRewardsHistory() || {};
  const { offset, setOffset, limit } = params;
  const { formattedEntries, isFetching, error, disableNextPage, lastOffset, refetch } = query || {};

  if (isFetching) {
    return (
      <WidgetContent variant="full">
        <Skeleton width="100%" height={26} />
        <ListTable.Pad>
          {[...Array(limit)].map((_, index) => (
            <Skeleton key={`rewards-history-skeleton-${index}`} width="100%" height={36} />
          ))}
          <Skeleton width={100} height={18} />
        </ListTable.Pad>
      </WidgetContent>
    );
  }

  if (error) {
    return (
      <WidgetContent variant="full">
        <ListTable.Pad className={S.errorPad}>
          <ErrorRetryModule onRetry={refetch} isLoading={isFetching} />
        </ListTable.Pad>
      </WidgetContent>
    );
  }

  return (
    <WidgetContent variant="full">
      {formattedEntries?.length ? (
        <ListTable.Pad>
          <ListTable.List>
            {formattedEntries?.map((rewardsHistory, index) => (
              <ListItem key={index + rewardsHistory.id} rewardsHistory={rewardsHistory} network={network} />
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
    </WidgetContent>
  );
};

const ListItem = ({
  rewardsHistory,
  network,
}: {
  rewardsHistory: Omit<RewardsHistoryItem, "amount"> & { amount: string };
  network: Network | null;
}) => {
  const amount = useDynamicAssetValueFromCoin({ coinVal: rewardsHistory.amount });
  const href = `${networkExplorer[network || defaultNetwork]}tx/${rewardsHistory.id}`;

  return (
    <ListTable.Item>
      <ListTable.ExternalLinkItemWrapper href={rewardsHistory.id ? href : undefined}>
        <ListTable.TxInfoPrimary
          title={titleKey[rewardsHistory.type]}
          externalLink={!!rewardsHistory.id}
          amount={amount || "－"}
          isProcessing={rewardsHistory.inProgress}
        />
        <ListTable.TxInfoSecondary
          time={
            !rewardsHistory.inProgress
              ? getUTCStringFromUnixTimestamp(rewardsHistory.timestamp)
              : getUTCStringFromUnixTimeString(rewardsHistory.created_at)
          }
          reward={`Reward ${getPercentagedNumber(rewardsHistory.rewardRate)}`}
          isProcessing={rewardsHistory.inProgress}
        />
      </ListTable.ExternalLinkItemWrapper>
    </ListTable.Item>
  );
};

const titleKey = {
  compound: "Compound",
  rewards: "Rewards",
};
