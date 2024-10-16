"use client";
import cn from "classnames";
import type { Network } from "../../../types";
import type { TabButtonProps } from "../../../_components/TabButton";
import type {
  ActivityItem,
  AddressActivityPaginationParams,
  StandardAddressActivityPaginationParams,
} from "../../../_services/stakingOperator/types";
import BigNumber from "bignumber.js";
import { useShell } from "../../../_contexts/ShellContext";
import { Skeleton } from "../../../_components/Skeleton";
import * as ListTable from "../../../_components/ListTable";
import { EmptyState } from "../../../_components/EmptyState";
import { ErrorRetryModule } from "../../../_components/ErrorRetryModule";
import { getPercentagedNumber } from "../../../_utils/number";
import { getUTCStringFromUnixTimestamp, getUTCStringFromUnixTimeString } from "../../../_utils/time";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import { getIsAleoNetwork } from "../../../_services/aleo/utils";
import { useActivity } from "../../../_services/stakingOperator/hooks";
import { networkExplorerTx, defaultNetwork } from "../../../consts";
import * as S from "./activity.css";
import { Icon } from "@/app/_components/Icon";

export const ActivityTable = () => {
  const { network } = useShell();
  const { params, query } = useActivity(null) || {};
  const { offset, setOffset, limit, filterKey, setFilterKey } = params;
  const { formattedEntries, isLoading, error, disableNextPage, lastOffset, refetch } = query || {};
  const tabs = useTabs({ filterKey, setFilterKey });

  const isAleo = getIsAleoNetwork(network);

  if (isLoading) {
    return (
      <>
        <Skeleton width="100%" height={26} />
        <ListTable.Pad className={cn({ [S.aleoActivityPad]: isAleo })}>
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
        <ErrorRetryModule onRetry={refetch} isLoading={isLoading} />
      </ListTable.Pad>
    );
  }

  return (
    <>
      {isAleo && (
        <div className={S.infoBanner}>
          <Icon name="info" /> <span>Activity may take a few min to appear.</span>{" "}
        </div>
      )}
      <ListTable.Tabs tabs={tabs} />
      {formattedEntries?.length ? (
        <ListTable.Pad className={cn({ [S.aleoActivityPad]: isAleo })}>
          <ListTable.List className={cn({ [S.aleoActivityList]: isAleo })}>
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

const ListItem = ({ activity, network }: { activity: ListItem; network: Network | null }) => {
  const isAmountSmall =
    activity.amount && BigNumber(activity.amount).isLessThan(0.01) && BigNumber(activity.amount).isGreaterThan(0);
  const formattedAmount = useDynamicAssetValueFromCoin({
    coinVal: activity.amount,
    minValue: !isAmountSmall ? undefined : 0.000001,
    formatOptions: !isAmountSmall ? undefined : { mantissa: 6 },
  });
  const amountValue = getAmountValue({ activity, formattedAmount });
  const href = `${networkExplorerTx[network || defaultNetwork]}${activity.id}`;
  const showRewardRate = network !== "aleo";

  const isInProgress = activity.inProgress;
  const hasValidLink = network === "aleo" ? !!activity.id && !isInProgress : !!activity.id;

  return (
    <ListTable.Item>
      <ListTable.ExternalLinkItemWrapper href={hasValidLink ? href : undefined}>
        <ListTable.TxInfoPrimary
          title={getTitleKey(activity)}
          externalLink={hasValidLink}
          amount={amountValue}
          isProcessing={isInProgress}
          isSuccess={activity.result === undefined ? undefined : activity.result === "success"}
          network={network}
        />
        <ListTable.TxInfoSecondary
          time={
            !isInProgress
              ? getUTCStringFromUnixTimestamp(activity.timestamp)
              : getUTCStringFromUnixTimeString(activity.created_at)
          }
          reward={showRewardRate ? `Reward ${getPercentagedNumber(activity.rewardRate)}` : undefined}
          isProcessing={isInProgress}
          network={network}
        />
      </ListTable.ExternalLinkItemWrapper>
    </ListTable.Item>
  );
};

const useTabs = ({
  filterKey,
  setFilterKey,
}: {
  filterKey: AddressActivityPaginationParams["filterKey"];
  setFilterKey: (key?: AddressActivityPaginationParams["filterKey"]) => void;
}) => {
  const { network } = useShell();
  const isAleo = getIsAleoNetwork(network);

  if (isAleo) {
    return [
      {
        children: "All",
        state: filterKey === "transactions" ? "highlighted" : "default",
        onClick: () => setFilterKey("transactions"),
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
      {
        children: "Withdraw",
        state: filterKey === "claim" ? "highlighted" : "default",
        onClick: () => setFilterKey("claim"),
      },
    ] as Array<TabButtonProps>;
  }

  const castedFilterKey = filterKey as StandardAddressActivityPaginationParams["filterKey"];
  return [
    {
      children: "All",
      state: castedFilterKey === "transactions" ? "highlighted" : "default",
      onClick: () => setFilterKey("transactions"),
    },
    {
      children: "Stake",
      state: castedFilterKey === "transactions_stake" ? "highlighted" : "default",
      onClick: () => setFilterKey("transactions_stake"),
    },
    {
      children: "Unstake",
      state: castedFilterKey === "transactions_unstake" ? "highlighted" : "default",
      onClick: () => setFilterKey("transactions_unstake"),
    },
    {
      children: "Claim",
      state: castedFilterKey === "transactions_rewards" ? "highlighted" : "default",
      onClick: () => setFilterKey("transactions_rewards"),
    },
    // {
    //   children: "Import",
    //   state: filterKey === "transactions_redelegate" ? "highlighted" : "default",
    //   onClick: () => setFilterKey("transactions_redelegate"),
    // },
  ] as Array<TabButtonProps>;
};

const getTitleKey = (activity: ListItem) => {
  switch (activity.type) {
    case "stake":
      if (!activity.staking_option) return "Stake";
      return activity.staking_option === "native" ? "Stake (Native)" : "Stake (Liquid)";
    case "unstake":
      if (!activity.staking_option) return "Unstake";
      if (activity.staking_option === "native") return "Unstake (Native)";
      return activity.status.toLowerCase().includes("instant") ? "Unstake (Liquid instant)" : "Unstake (Liquid)";
    case "claim":
      return "Withdraw";
    case "rewards":
      return "Claim";
    case "redelegate":
      return "Import";
  }
};

const getAmountValue = ({ activity, formattedAmount }: { activity: ListItem; formattedAmount?: string }) => {
  if (activity.type === "claim") {
    return undefined;
  }

  return activity.type === "rewards" && activity.inProgress && activity.amount === "0"
    ? "Collecting.."
    : formattedAmount || "-";
};

type ListItem = Omit<ActivityItem, "amount" | "completionTime"> & { amount: string };
