"use client";
import type { Network } from "../../../../types";
import type { RewardsHistoryItem } from "../../../../_services/stakingOperator/types";
import { useShell } from "../../../../_contexts/ShellContext";
import { Skeleton } from "../../../../_components/Skeleton";
import * as ListTable from "../../../../_components/ListTable";
import { ErrorRetryModule } from "../../../../_components/ErrorRetryModule";
import { getPercentagedNumber } from "../../../../_utils/number";
import { getUTCStringFromUnixTimestamp } from "../../../../_utils/time";
import { useDynamicAssetValueFromCoin } from "../../../../_utils/conversions/hooks";
import { useRewardsHistory } from "../../../../_services/stakingOperator/hooks";
import { networkExplorer, defaultNetwork } from "../../../../consts";
import * as S from "./historyTable.css";

export const RewardsHistoryTable = () => {
  const { network } = useShell();
  const { params, query } = useRewardsHistory() || {};
  const { offset, setOffset, limit } = params;
  const { data, isFetching, error, disableNextPage, lastOffset, refetch } = query || {};

  if (isFetching) {
    return (
      <>
        <Skeleton width="100%" height={26} />
        <ListTable.Pad>
          {[...Array(limit)].map((_, index) => (
            <Skeleton key={`rewards-history-skeleton-${index}`} width="100%" height={36} />
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
      <ListTable.Pad>
        <ListTable.List>
          {data?.map((rewardsHistory, index) => (
            <ListItem key={index + rewardsHistory.txHash} rewardsHistory={rewardsHistory} network={network} />
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
    </>
  );
};

const ListItem = ({ rewardsHistory, network }: { rewardsHistory: RewardsHistoryItem; network: Network | null }) => {
  const amount = useDynamicAssetValueFromCoin({ coinVal: rewardsHistory.amount });

  return (
    <ListTable.Item>
      <ListTable.ExternalLinkItemWrapper
        href={`${networkExplorer[network || defaultNetwork]}tx/${rewardsHistory.txHash}`}
      >
        <ListTable.TxInfoPrimary
          title={titleKey[rewardsHistory.type]}
          externalLink={!!rewardsHistory.txHash}
          amount={amount || "－"}
          isProcessing={rewardsHistory.inProgress}
        />
        <ListTable.TxInfoSecondary
          time={getUTCStringFromUnixTimestamp(rewardsHistory.timestamp)}
          reward={`Reward ${getPercentagedNumber(rewardsHistory.rewardRate)}`}
          isProcessing={rewardsHistory.inProgress}
        />
      </ListTable.ExternalLinkItemWrapper>
    </ListTable.Item>
  );
};

const titleKey = {
  compound: "Compound",
};
