import type { UnbondingDelegation } from "../../unstake/types";
import type * as T from "../types";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useStaking } from "@/app/_contexts/StakingContext";
import { getTimeDiffInSingleUnits } from "../../../_utils/time";
import { getCoinValueFromDenom } from "../../cosmos/utils";
import { getLastOffset } from "../utils";
import {
  getAddressAuthCheck,
  getDelegations,
  getUnbondingDelegations,
  getAddressActivity,
  getAddressRewardsHistory,
  getNetworkReward,
  calculateRewards,
} from ".";

export const useCelestiaAddressAuthCheck = ({ address }: { address?: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaAddressAuthCheck", address],
    queryFn: () => getAddressAuthCheck(address || ""),
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error, refetch };
};

export const useCelestiaDelegations = ({ address }: { address?: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaDelegations", address],
    queryFn: () => getDelegations(address || ""),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });
  const stakedBalance = useStakedBalance({ delegations: data });

  return { data, stakedBalance: !isLoading && !error ? stakedBalance : undefined, isLoading, error, refetch };
};

export const useCelestiaUnbondingDelegations = ({ address }: { address?: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaUnbondingDelegations", address],
    queryFn: () => getUnbondingDelegations(address || ""),
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
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & { address?: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressActivityResponse | null,
    T.AddressActivityResponse
  >({
    enabled: !!address,
    queryKey: ["addressActivity", address, offset, limit, filterKey],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressActivity({ address, offset, limit, filterKey });
    },
    placeholderData: keepPreviousData,
    staleTime: 15000,
  });

  // Prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      const nextOffset = offset + 1;
      queryClient.prefetchQuery({
        queryKey: ["addressActivity", address, limit, filterKey, nextOffset],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressActivity({ address, offset: nextOffset, limit, filterKey });
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

export const useAddressRewardsHistory = ({
  address,
  offset,
  limit,
}: T.AddressRewardsHistoryPaginationParams & { address?: string }) => {
  const queryClient = useQueryClient();

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressRewardsHistoryResponse | null,
    T.AddressRewardsHistoryResponse
  >({
    enabled: !!address,
    queryKey: ["addressRewardsHistory", address, offset, limit],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressRewardsHistory({ address, offset, limit });
    },
    placeholderData: keepPreviousData,
    staleTime: 15000,
  });

  // Prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      const nextOffset = offset + 1;
      queryClient.prefetchQuery({
        queryKey: ["addressRewardsHistory", address, limit, nextOffset],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressRewardsHistory({ address, offset: nextOffset, limit });
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

export const useNetworkReward = () => {
  const { coinAmountInput } = useStaking();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["networkReward"],
    queryFn: () => getNetworkReward(),
    refetchInterval: 90000,
    refetchOnWindowFocus: true,
  });

  const rewards = calculateRewards(coinAmountInput || "0", data || 0);

  return { data, rewards, isLoading, error, refetch };
};
