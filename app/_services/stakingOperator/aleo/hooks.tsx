import type { Network } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { serverUrlByNetwork, stakingOperatorUrlByNetwork } from "../../../consts";
import { getIsAleoNetwork, getMicroCreditsToCredits } from "../../aleo/utils";
import {
  getServerStatus,
  getAddressBalance,
  getAddressStakedBalance,
  getNetworkStatus,
  getAddressDelegation,
  getValidatorDetails,
} from ".";

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

export const useAleoAddressBalance = ({ network, address }: { network: Network | null; address: string }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsAleoNetwork(network || ""),
    queryKey: ["aleoAddressBalance", network, address],
    queryFn: () => getAddressBalance({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address }),
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return { data, isLoading, isRefetching, error, refetch };
};

export const useAleoAddressStakedBalance = ({ network, address }: { network: Network | null; address: string }) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    enabled: getIsAleoNetwork(network || ""),
    queryKey: ["aleoAddressStakedBalance", network, address],
    queryFn: () => getAddressStakedBalance({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address }),
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

export const useAleoDelegatedValidator = ({ network, address }: { network: Network | null; address: string }) => {
  const { data, isLoading, isRefetching, error } = useQuery({
    enabled: getIsAleoNetwork(network || "") && !!address,
    queryKey: ["aleoDelegatedValidator", network, address],
    queryFn: () => getAddressDelegation({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address }),
  });

  return { data, isLoading, isRefetching, error };
};

export const useAleoValidatorDetails = ({ network, address }: { network: Network | null; address?: string }) => {
  const { data, isLoading, isRefetching, error } = useQuery({
    enabled: getIsAleoNetwork(network || "") && !!address,
    queryKey: ["aleoValidatorDetails", network, address],
    queryFn: () =>
      getValidatorDetails({ apiUrl: stakingOperatorUrlByNetwork[network || "aleo"], address: address || "" }),
  });

  return { data, isLoading, isRefetching, error };
};
