import type { AleoNetwork, Network, StakingType } from "../../../types";
import type * as T from "../types";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { networkDefaultStakingType, serverUrlByNetwork, stakingOperatorUrlByNetwork } from "../../../consts";
import {
  getIsAleoNetwork,
  getCoinValueFromDenom,
  getMicroCreditsToCredits,
  getIsAleoAddressFormat,
} from "../../aleo/utils";
import {
  getAddressRewards,
  getAddressActivity,
  getAddressBalance,
  getAddressDelegation,
  getAddressStakedBalance,
  getNetworkReward,
  getNetworkStatus,
  getServerStatus,
  getValidatorDetails,
} from ".";
import { useEffect, useState } from "react";
import { getCalculatedRewards, getLastOffset } from "../utils";
import { getTimeDiffInSingleUnits } from "@/app/_utils/time";
import { fromUnixTime } from "date-fns";
import { useShell } from "@/app/_contexts/ShellContext";

export const useAleoAddressRewards = ({ address, network }: { address: string; network: Network | null }) => {
  const shouldEnable = getIsAleoNetwork(network || "") && getIsAleoAddressFormat(address);

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoAddressRewards", network, address],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getAddressRewards({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return {
    data: {
      cumulativeRewards: getMicroCreditsToCredits(data?.cumulativeRewards || 0),
      dailyRewards: null,
      accruedRewards: null,
      lastCycleRewards: null,
    },
    isLoading,
    isRefetching,
    error,
    refetch,
  };
};

export const useAleoAddressActivity = ({
  network,
  address,
  offset,
  limit,
  filterKey,
}: T.AleoAddressActivityPaginationParams & { network: Network | null; address?: string; refetchInterval?: number }) => {
  const queryClient = useQueryClient();
  const [hasInProgress, setHasInProgress] = useState(false);
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const castedNetwork = (isAleoNetwork ? network : "aleo") as AleoNetwork;

  const { data, error, isPlaceholderData, status, isLoading, isFetching, refetch } = useQuery<
    T.AddressActivityResponse | null,
    T.AddressActivityResponse
  >({
    enabled: !!address && !!isAleoNetwork,
    queryKey: ["aleoAddressActivityKey", address, offset, limit, filterKey, network],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getAddressActivity({
        tsType: "aleo",
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
        queryKey: ["aleoAddressActivityKey", address, limit, filterKey, nextOffset, network],
        queryFn: () => {
          if (!address) return Promise.resolve(null);
          return getAddressActivity({
            tsType: "aleo",
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
      amount: getCoinValueFromDenom({ network: castedNetwork, amount: getMicroCreditsToCredits(entry.amount) }),
      completionTime: entry.completionTime
        ? getTimeDiffInSingleUnits(fromUnixTime(entry.completionTime || 0))
        : undefined,
      // TODO: use real Aleo activity result when staking operator has the data
      result: undefined,
    })),
    totalEntries,
    lastOffset,
    refetch,
  };
};

export const useAleoUnbondingDelegations = ({ address, network }: { address?: string; network: Network | null }) => {
  const { stakingType } = useShell();
  const castedStakingType = (stakingType || networkDefaultStakingType["aleo"]) as StakingType;

  const {
    totalEntries,
    isLoading: initialIsLoading,
    error: initialIsError,
  } = useAleoAddressActivity({
    tsType: "aleo",
    network,
    address,
    filterKey: `${castedStakingType}_unstake`,
    offset: 0,
    limit: 999,
  }) || {};
  const { formattedEntries, isLoading, error } =
    useAleoAddressActivity({
      tsType: "aleo",
      network,
      address,
      filterKey: `${castedStakingType}_unstake`,
      offset: 0,
      limit: totalEntries || 999,
    }) || {};

  const inProgressUnbondingEntries = formattedEntries?.filter((entry) => entry.inProgress) || [];
  const unbondingEntries = formattedEntries?.filter((entry) => entry.status === "UNDELEGATE_IN_PROGRESS") || [];

  return {
    data: [...inProgressUnbondingEntries, ...unbondingEntries],
    isLoading: initialIsLoading || isLoading,
    error: initialIsError || error,
  };
};

export const useAleoServerStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsAleoNetwork(network || ""),
    queryKey: ["aleoServerStatus", network],
    queryFn: () => getServerStatus({ apiUrl: serverUrlByNetwork[network || "aleo"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useAleoAddressBalance = ({ network, address }: { network: Network | null; address?: string }) => {
  const shouldEnable = getIsAleoNetwork(network || "") && getIsAleoAddressFormat(address || "");

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoAddressBalance", network, address],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getAddressBalance({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address: address || "" });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useAleoAddressStakedBalance = ({ network, address }: { network: Network | null; address?: string }) => {
  const shouldEnable = getIsAleoNetwork(network || "") && getIsAleoAddressFormat(address || "");

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoAddressStakedBalance", network, address],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getAddressStakedBalance({
        apiUrl: stakingOperatorUrlByNetwork[network || "aleo"],
        address: address || "",
      });
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return {
    data,
    stakedBalance: getMicroCreditsToCredits(data?.["total-staked"] || 0).toString(),
    isLoading,
    isRefetching,
    error,
    refetch,
  };
};

export const useAleoStatus = ({ network }: { network: Network | null }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsAleoNetwork(network || ""),
    queryKey: ["aleoStatus", network],
    queryFn: () => getNetworkStatus({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useAleoReward = ({ network, amount }: { network: Network | null; amount: string }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsAleoNetwork(network || ""),
    queryKey: ["aleoReward", network],
    queryFn: () => getNetworkReward({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"] }),
    refetchOnWindowFocus: true,
    refetchInterval: 600000, // 10 minutes
  });

  const rewards = getCalculatedRewards(amount, data || 0);

  return { data, rewards, isLoading, isRefetching, error, refetch };
};

export const useAleoDelegatedValidator = ({ network, address }: { network: Network | null; address?: string }) => {
  const shouldEnable = getIsAleoNetwork(network || "") && getIsAleoAddressFormat(address || "");

  const { data, isLoading, isRefetching, error } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoDelegatedValidator", network, address],
    queryFn: () => {
      if (!shouldEnable) return undefined;
      return getAddressDelegation({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address: address || "" });
    },
  });

  return { data, isLoading, isRefetching, error };
};

export const useAleoValidatorDetails = ({ network, address }: { network: Network | null; address?: string }) => {
  const shouldEnable = getIsAleoNetwork(network || "") && getIsAleoAddressFormat(address || "");

  const { data, isLoading, isRefetching, error } = useQuery({
    enabled: shouldEnable,
    queryKey: ["aleoValidatorDetails", network, address],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getValidatorDetails({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address: address || "" });
    },
  });

  return { data, isLoading, isRefetching, error };
};
