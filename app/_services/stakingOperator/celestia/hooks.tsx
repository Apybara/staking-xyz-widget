import type { Network } from "../../../types";
import type { UnbondingDelegation } from "../../unstake/types";
import type * as T from "../types";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { fromUnixTime } from "date-fns";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { serverUrlByNetwork, stakingOperatorUrlByNetwork } from "../../../consts";
import { getTimeDiffInSingleUnits } from "../../../_utils/time";
import { getCoinValueFromDenom } from "../../cosmos/utils";
import { getCalculatedRewards, getLastOffset } from "../utils";
import {
  getAddressAuthCheck,
  getDelegations,
  getUnbondingDelegations,
  getAddressActivity,
  getAddressRewardsHistory,
  getNetworkReward,
  getAddressRewards,
  getNetworkStatus,
  getServerStatus,
  getExternalDelegations,
} from ".";
import numbro from "numbro";

export const useCelestiaAddressAuthCheck = ({ address, network }: { address?: string; network: Network | null }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["celestiaAddressAuthCheck", address, network],
    queryFn: () =>
      getAddressAuthCheck({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"], address: address || "" }),
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error, refetch };
};

export const useCelestiaDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["celestiaDelegations", address, network],
    queryFn: () =>
      getDelegations({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"], address: address || "" }),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });
  const stakedBalance = useStakedBalance({ delegations: data });

  return { data, stakedBalance: !isLoading && !error ? stakedBalance : undefined, isLoading, error, refetch };
};

export const useCelestiaUnbondingDelegations = ({
  address,
  network,
}: {
  address?: string;
  network: Network | null;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["celestiaUnbondingDelegations", address, network],
    queryFn: () =>
      getUnbondingDelegations({
        apiUrl: stakingOperatorUrlByNetwork[network || "celestia"],
        address: address || "",
      }),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });

  const formatted = useFormattedUnbondingDelegations(data);

  return { data, formatted, isLoading, error, refetch };
};

export const useCelestiaExternalDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const castedNetwork = network || "celestia";
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["celestiaExternalDelegations", address, network],
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

export const useCelestiaAddressActivity = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & { network: Network | null; address?: string; refetchInterval?: number }) => {
  const queryClient = useQueryClient();
  const [hasInProgress, setHasInProgress] = useState(false);

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressActivityResponse | null,
    T.AddressActivityResponse
  >({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["addressActivity", address, offset, limit, filterKey, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressActivity({
        apiUrl: stakingOperatorUrlByNetwork[network || "celestia"],
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
            apiUrl: stakingOperatorUrlByNetwork[network || "celestia"],
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
      amount: getCoinValueFromDenom({ network: network || "celestia", amount: entry.amount }),
      completionTime: entry.completionTime
        ? getTimeDiffInSingleUnits(fromUnixTime(entry.completionTime || 0))
        : undefined,
    })),
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useCelestiaAddressRewards = ({ network, address }: { network: Network | null; address?: string }) => {
  const { data, error, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsResponse | null,
    T.AddressRewardsResponse
  >({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["addressRewards", address, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewards({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"], address });
    },
    refetchInterval: 12000, // 12 seconds
    placeholderData: keepPreviousData,
  });

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    data: {
      total_rewards: getCoinValueFromDenom({ network: network || "celestia", amount: data?.data?.total_rewards }),
      last_cycle_rewards: getCoinValueFromDenom({
        network: network || "celestia",
        amount: data?.data?.last_cycle_rewards,
      }),
      daily_rewards: getCoinValueFromDenom({ network: network || "celestia", amount: data?.data?.daily_rewards }),
      accrued_rewards: getCoinValueFromDenom({ network: network || "celestia", amount: data?.data?.accrued_rewards }),
    },
    refetch,
  };
};

export const useCelestiaAddressRewardsHistory = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressRewardsHistoryPaginationParams & { network: Network | null; address?: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsHistoryResponse | null,
    T.AddressRewardsHistoryResponse
  >({
    enabled: !!address && getIsCelestiaNetwork(network),
    queryKey: ["addressRewardsHistory", address, offset, limit, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewardsHistory({
        apiUrl: stakingOperatorUrlByNetwork[network || "celestia"],
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
            apiUrl: stakingOperatorUrlByNetwork[network || "celestia"],
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
      amount: getCoinValueFromDenom({ network: network || "celestia", amount: entry.amount }),
    })),
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useCelestiaReward = ({ network, amount }: { network: Network | null; amount: string }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCelestiaNetwork(network),
    queryKey: ["celestiaReward", network, amount],
    queryFn: () => getNetworkReward({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"] }),
    refetchInterval: 600000, // 10 minutes
    refetchOnWindowFocus: true,
  });

  const rewards = getCalculatedRewards(amount, data || 0);

  return { data, rewards, isLoading: isLoading || isRefetching, error, refetch };
};

export const useCelestiaStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCelestiaNetwork(network),
    queryKey: ["celestiaStatus", network],
    queryFn: () => getNetworkStatus({ apiUrl: stakingOperatorUrlByNetwork[network || "celestia"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useCelestiaServerStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsCelestiaNetwork(network),
    queryKey: ["celestiaServerStatus", network],
    queryFn: () => getServerStatus({ apiUrl: serverUrlByNetwork[network || "celestia"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

const useStakedBalance = ({ delegations }: { delegations?: Array<T.DelegationResponseItem> }) => {
  if (delegations === undefined) return undefined;
  if (!delegations?.length) return "0";

  const amount = delegations.reduce((acc, { balance }) => {
    return acc.plus(balance.amount);
  }, BigNumber(0));

  return getCoinValueFromDenom({ network: "celestia", amount: amount.toString() });
};

const useFormattedUnbondingDelegations = (
  delegations?: Array<T.UnbondingDelegationResponseItem>,
): Array<UnbondingDelegation> => {
  const formattedDelegations: Array<UnbondingDelegation> = [];

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

const getIsCelestiaNetwork = (network: Network | null) => network === "celestia" || network === "celestiatestnet3";
const getIsCosmoshubNetwork = (network: Network | null) => network === "cosmoshub" || network === "cosmoshubtestnet";
