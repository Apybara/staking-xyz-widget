import type { Network } from "../../types";
import * as T from "./types";
import { useEffect, useState } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import {
  useCelestiaDelegations,
  useCelestiaUnbondingDelegations,
  useAddressActivity,
  useAddressRewardsHistory,
  useCelestiaReward,
  useAddressRewards,
  useCelestiaStatus,
  useCelestiaServerStatus,
} from "../stakingOperator/celestia/hooks";
import { useStaking } from "@/app/_contexts/StakingContext";

export const useUnbondingDelegations = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = useCelestiaUnbondingDelegations({
    network,
    address: address && (network === "celestia" || network === "celestiatestnet3") ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    default:
      return undefined;
  }
};

export const useStakedBalance = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = useCelestiaDelegations({
    network,
    address: address && (network === "celestia" || network === "celestiatestnet3") ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    default:
      return undefined;
  }
};

export const useAddressActivityQueryParams = (defaultParams: T.AddressActivityPaginationParams | null) => {
  const [offset, setOffset] = useState(defaultParams?.offset || 0);
  const [limit, setLimit] = useState(defaultParams?.limit || 6);
  const [filterKey, setFilterKey] = useState<T.AddressActivityPaginationParams["filterKey"]>(
    defaultParams?.filterKey || "transactions",
  );

  useEffect(() => {
    if (offset !== 0) {
      setOffset(0);
    }
  }, [filterKey, limit]);

  return {
    offset,
    setOffset,
    limit,
    setLimit,
    filterKey,
    setFilterKey,
  };
};

export const useActivity = (defaultParams: T.AddressActivityPaginationParams | null) => {
  const { network } = useShell();
  const { address } = useWallet();

  const { offset, setOffset, limit, filterKey, setFilterKey } = useAddressActivityQueryParams(defaultParams);
  const celestia = useAddressActivity({
    network,
    address: address && (network === "celestia" || network === "celestiatestnet3") ? address : undefined,
    offset,
    limit,
    filterKey,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return {
        params: { offset, setOffset, limit, filterKey, setFilterKey },
        query: celestia,
      };
    default:
      return {
        params: { offset, setOffset, limit, filterKey, setFilterKey },
        query: undefined,
      };
  }
};

export const useLastOffsetActivity = ({ offset, limit, filterKey }: T.AddressActivityPaginationParams) => {
  const { network } = useShell();
  const { address } = useWallet();
  const { lastOffset } = useAddressActivity({ network, address: address || undefined, offset, limit, filterKey });

  return useAddressActivity({ network, address: address || undefined, offset: lastOffset, limit, filterKey });
};

export const useAddressRewardsHistoryQueryParams = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(6);

  return {
    offset,
    setOffset,
    limit,
    setLimit,
  };
};

export const useRewards = () => {
  const { network } = useShell();
  const { address } = useWallet();

  const celestia = useAddressRewards({
    network,
    address: address && (network === "celestia" || network === "celestiatestnet3") ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return {
        query: celestia,
      };
    default:
      return {
        query: undefined,
      };
  }
};

export const useRewardsHistory = () => {
  const { network } = useShell();
  const { address } = useWallet();

  const { offset, setOffset, limit } = useAddressRewardsHistoryQueryParams();
  const celestia = useAddressRewardsHistory({
    network,
    address: address && (network === "celestia" || network === "celestiatestnet3") ? address : undefined,
    offset,
    limit,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return {
        params: { offset, setOffset, limit },
        query: celestia,
      };
    default:
      return {
        params: { offset, setOffset, limit },
        query: undefined,
      };
  }
};

export const useLastOffsetRewardsHistory = ({ offset, limit }: T.AddressRewardsHistoryPaginationParams) => {
  const { network } = useShell();
  const { address } = useWallet();
  const { lastOffset } = useAddressRewardsHistory({ network, address: address || undefined, offset, limit });

  return useAddressRewardsHistory({ network, address: address || undefined, offset: lastOffset, limit });
};

export const useNetworkReward = (args?: { defaultNetwork?: Network; amount?: string }) => {
  const { defaultNetwork, amount } = args || {};
  const { network } = useShell();
  const { coinAmountInput } = useStaking();
  const castedNetwork = defaultNetwork || network;

  const celestiaRewards = useCelestiaReward({ network: castedNetwork, amount: amount || coinAmountInput || "0" });

  switch (castedNetwork) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaRewards;
    default:
      return undefined;
  }
};

export const useNetworkStatus = (defaultNetwork?: string) => {
  const { network } = useShell();
  const celestiaStatus = useCelestiaStatus({ network });

  switch (defaultNetwork || network) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaStatus;
    default:
      return undefined;
  }
};

export const useServerStatus = (defaultNetwork?: string) => {
  const { network } = useShell();
  const celestiaStatus = useCelestiaServerStatus({ network });

  switch (defaultNetwork || network) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaStatus;
    default:
      return undefined;
  }
};
