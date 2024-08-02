import type { CosmosNetwork, Network } from "../../../types";
import type * as T from "../types";
import { useEffect, useState } from "react";
import { fromUnixTime } from "date-fns";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { serverUrlByNetwork, stakingOperatorUrlByNetwork } from "../../../consts";
import { getTimeDiffInSingleUnits } from "../../../_utils/time";
import { getCoinValueFromDenom, getIsCosmosNetwork } from "../../cosmos/utils";
import { getCalculatedRewards, getLastOffset } from "../utils";
import {
  getAddressAuthCheck,
  getDelegations,
  getAddressActivity,
  getAddressRewardsHistory,
  getNetworkReward,
  getAddressRewards,
  getNetworkStatus,
  getServerStatus,
  getExternalDelegations,
} from "./";

export const useCosmosAddressAuthCheck = ({ address, network }: { address?: string; network: Network | null }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && getIsCosmosNetwork(network || ""),
    queryKey: ["cosmosAddressAuthCheck", address, network],
    queryFn: () =>
      getAddressAuthCheck({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"], address: address || "" }),
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error, refetch };
};

export const useCosmosDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : "celestia") as CosmosNetwork;

  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!network && !!address && !!isCosmosNetwork,
    queryKey: ["cosmosDelegations", address, network],
    queryFn: () => getDelegations({ apiUrl: stakingOperatorUrlByNetwork[castedNetwork], address: address || "" }),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });
  const stakedBalance = getCoinValueFromDenom({ network: castedNetwork, amount: data?.total.toString() });

  return { data, stakedBalance: !isLoading && !error ? stakedBalance : undefined, isLoading, error, refetch };
};

export const useCosmosExternalDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : "celestia") as CosmosNetwork;

  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && !!isCosmosNetwork,
    queryKey: ["cosmosExternalDelegations", address, network],
    queryFn: () =>
      getExternalDelegations({ apiUrl: stakingOperatorUrlByNetwork[castedNetwork], address: address || "" }),
    refetchOnWindowFocus: true,
  });

  return {
    data: {
      redelegationAmount: getCoinValueFromDenom({ network: castedNetwork, amount: data?.response?.total.toString() }),
    },
    isLoading,
    error,
    refetch,
  };
};

export const useCosmosAddressActivity = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.StandardAddressActivityPaginationParams & {
  network: Network | null;
  address?: string;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();
  const [hasInProgress, setHasInProgress] = useState(false);
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : "celestia") as CosmosNetwork;

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressActivityResponse | null,
    T.AddressActivityResponse
  >({
    enabled: !!address && !!isCosmosNetwork,
    queryKey: ["addressActivity", address, offset, limit, filterKey, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressActivity({
        tsType: "standard",
        apiUrl: stakingOperatorUrlByNetwork[castedNetwork],
        address,
        offset,
        limit,
        filterKey,
      });
    },
    refetchInterval: hasInProgress ? 5000 : 180000,
    placeholderData: keepPreviousData,
  });

  // Prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      const nextOffset = offset + 1;
      queryClient.prefetchQuery({
        queryKey: ["addressActivity", address, limit, filterKey, nextOffset, network],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressActivity({
            tsType: "standard",
            apiUrl: stakingOperatorUrlByNetwork[castedNetwork],
            address,
            offset: nextOffset,
            limit,
            filterKey,
          });
        },
      });
    }
  }, [queryClient, address, data?.hasMore, isPlaceholderData, limit, offset, filterKey]);

  const totalEntries = data?.totalEntries || 0;
  const lastOffset = getLastOffset({ totalEntries, limit });

  useEffect(() => {
    const hasInProgressEntry = data?.data?.entries?.some((entry) => entry.inProgress);
    setHasInProgress(hasInProgressEntry || false);
  }, [data?.data?.entries]);

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    disableNextPage: isPlaceholderData || lastOffset === offset,
    data: data?.data,
    formattedEntries: data?.data?.entries?.map((entry) => ({
      ...entry,
      amount: getCoinValueFromDenom({ network: castedNetwork, amount: entry.amount }),
      completionTime: entry.completionTime
        ? getTimeDiffInSingleUnits(fromUnixTime(entry.completionTime || 0))
        : undefined,
    })),
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useCosmosUnbondingDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const {
    totalEntries,
    isLoading: initialIsLoading,
    error: initialIsError,
  } = useCosmosAddressActivity({
    tsType: "standard",
    network,
    address,
    filterKey: "transactions_unstake",
    offset: 0,
    limit: 999,
  }) || {};
  const { formattedEntries, isLoading, error } =
    useCosmosAddressActivity({
      tsType: "standard",
      network,
      address,
      filterKey: "transactions_unstake",
      offset: 0,
      limit: totalEntries || 999,
    }) || {};

  const inProgressUnbondingEntries = formattedEntries?.filter((entry) => entry.inProgress) || [];
  const unbondingEntries = formattedEntries?.filter((entry) => !entry.inProgress && !!entry.completionTime) || [];

  return {
    data: [...inProgressUnbondingEntries, ...unbondingEntries],
    isLoading: initialIsLoading || isLoading,
    error: initialIsError || error,
  };
};

export const useCosmosAddressRewards = ({ network, address }: { network: Network | null; address?: string }) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : "celestia") as CosmosNetwork;

  const { data, error, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsResponse | null,
    T.AddressRewardsResponse
  >({
    enabled: !!address && !!isCosmosNetwork,
    queryKey: ["addressRewards", address, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewards({ apiUrl: stakingOperatorUrlByNetwork[castedNetwork], address });
    },
    refetchInterval: 12000, // 12 seconds
    placeholderData: keepPreviousData,
  });

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    data: {
      cumulativeRewards: getCoinValueFromDenom({ network: castedNetwork, amount: data?.data?.total_rewards }),
      lastCycleRewards: getCoinValueFromDenom({
        network: castedNetwork,
        amount: data?.data?.last_cycle_rewards,
      }),
      dailyRewards: getCoinValueFromDenom({ network: castedNetwork, amount: data?.data?.daily_rewards }),
      accruedRewards: getCoinValueFromDenom({ network: castedNetwork, amount: data?.data?.accrued_rewards }),
    },
    refetch,
  };
};

export const useCosmosAddressRewardsHistory = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressRewardsHistoryPaginationParams & { network: Network | null; address?: string }) => {
  const queryClient = useQueryClient();
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const castedNetwork = (isCosmosNetwork ? network : "celestia") as CosmosNetwork;

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsHistoryResponse | null,
    T.AddressRewardsHistoryResponse
  >({
    enabled: !!address && !!isCosmosNetwork,
    queryKey: ["addressRewardsHistory", address, offset, limit, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewardsHistory({
        apiUrl: stakingOperatorUrlByNetwork[castedNetwork],
        address,
        offset,
        limit,
        filterKey: filterKey || "transactions_rewards",
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 15000,
  });

  // Prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      const nextOffset = offset + 1;
      queryClient.prefetchQuery({
        queryKey: ["addressRewardsHistory", address, limit, nextOffset, network],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressRewardsHistory({
            apiUrl: stakingOperatorUrlByNetwork[castedNetwork],
            address,
            offset: nextOffset,
            limit,
            filterKey: filterKey || "transactions_rewards",
          });
        },
      });
    }
  }, [queryClient, address, data?.hasMore, isPlaceholderData, limit, offset]);

  const totalEntries = data?.totalEntries || 0;
  const lastOffset = getLastOffset({ totalEntries, limit });

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    disableNextPage: isPlaceholderData || lastOffset === offset,
    data: data?.data,
    formattedEntries: data?.data?.entries?.map((entry) => ({
      ...entry,
      amount: getCoinValueFromDenom({ network: castedNetwork, amount: entry.amount }),
    })),
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useCosmosReward = ({ network, amount }: { network: Network | null; amount: string }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCosmosNetwork(network || ""),
    queryKey: ["cosmosReward", network, amount],
    queryFn: () => getNetworkReward({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"] }),
    refetchInterval: 600000, // 10 minutes
    refetchOnWindowFocus: true,
  });

  const rewards = getCalculatedRewards(amount, data || 0);

  return { data, rewards, isLoading: isLoading || isRefetching, error, refetch };
};

export const useCosmosStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCosmosNetwork(network || ""),
    queryKey: ["cosmosStatus", network],
    queryFn: () => getNetworkStatus({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useCosmosServerStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCosmosNetwork(network || ""),
    queryKey: ["cosmosServerStatus", network],
    queryFn: () => getServerStatus({ apiUrl: serverUrlByNetwork[network || "celestia"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

const useFormattedUnbondingDelegations = (
  delegations?: Array<T.UnbondingDelegationResponseItem>,
): Array<T.UnbondingDelegation> => {
  const formattedDelegations: Array<T.UnbondingDelegation> = [];

  delegations?.forEach((delegation) => {
    delegation.entries.forEach((entry) => {
      formattedDelegations.push({
        validatorAddress: delegation.validator_address,
        remainingTime: getTimeDiffInSingleUnits(entry.completion_time),
        amount: getCoinValueFromDenom({ network: "celestia", amount: entry.balance }),
      });
    });
  });

  return formattedDelegations;
};
