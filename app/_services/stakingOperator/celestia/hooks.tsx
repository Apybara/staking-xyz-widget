import type { Network } from "../../../types";
import type { UnbondingDelegation } from "../../unstake/types";
import type * as T from "../types";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { defaultNetwork, serverUrlByNetwork, stakingOperatorUrlByNetwork } from "../../../consts";
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
} from ".";

export const useCelestiaAddressAuthCheck = ({ address, network }: { address?: string; network: Network | null }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaAddressAuthCheck", address, network],
    queryFn: () =>
      getAddressAuthCheck({ apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork], address: address || "" }),
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error, refetch };
};

export const useCelestiaDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaDelegations", address, network],
    queryFn: () =>
      getDelegations({ apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork], address: address || "" }),
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
    enabled: !!address,
    queryKey: ["celestiaUnbondingDelegations", address, network],
    queryFn: () =>
      getUnbondingDelegations({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address: address || "",
      }),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });

  const formatted = useFormattedUnbondingDelegations(data);

  return { data, formatted, isLoading, error, refetch };
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

export const useAddressActivity = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & { network: Network | null; address?: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressActivityResponse | null,
    T.AddressActivityResponse
  >({
    enabled: !!address,
    queryKey: ["addressActivity", address, offset, limit, filterKey, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressActivity({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
        offset,
        limit,
        filterKey,
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
        queryKey: ["addressActivity", address, limit, filterKey, nextOffset, network],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressActivity({
            apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
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

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    disableNextPage: isPlaceholderData || lastOffset === offset,
    data: data?.data,
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useAddressRewards = ({ network, address }: { network: Network | null; address?: string }) => {
  const { data, error, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsResponse | null,
    T.AddressRewardsResponse
  >({
    enabled: !!address,
    queryKey: ["addressRewards", address, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewards({ apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork], address });
    },
    placeholderData: keepPreviousData,
    staleTime: 15000,
  });

  return {
    error,
    isLoading: isLoading || status === "pending",
    isFetching,
    data: {
      total_rewards: getCoinValueFromDenom({ network: network || defaultNetwork, amount: data?.data?.total_rewards }),
      last_cycle_rewards: getCoinValueFromDenom({
        network: network || defaultNetwork,
        amount: data?.data?.last_cycle_rewards,
      }),
      daily_rewards: getCoinValueFromDenom({ network: network || defaultNetwork, amount: data?.data?.daily_rewards }),
    },
    refetch,
  };
};

export const useAddressRewardsHistory = ({
  network,
  address,
  offset,
  limit,
}: T.AddressRewardsHistoryPaginationParams & { network: Network | null; address?: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsHistoryResponse | null,
    T.AddressRewardsHistoryResponse
  >({
    enabled: !!address,
    queryKey: ["addressRewardsHistory", address, offset, limit, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewardsHistory({
        apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
        address,
        offset,
        limit,
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
            apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork],
            address,
            offset: nextOffset,
            limit,
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
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useCelestiaReward = ({ network, amount }: { network: Network | null; amount: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["celestiaReward", network],
    queryFn: () => getNetworkReward({ apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork] }),
    refetchOnWindowFocus: true,
  });

  const rewards = getCalculatedRewards(amount, data || 0);

  return { data, rewards, isLoading, error, refetch };
};

export const useCelestiaStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["celestiaStatus", network],
    queryFn: () => getNetworkStatus({ apiUrl: stakingOperatorUrlByNetwork[network || defaultNetwork] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useCelestiaServerStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["celestiaServerStatus", network],
    queryFn: () => getServerStatus({ apiUrl: serverUrlByNetwork[network || defaultNetwork] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};
