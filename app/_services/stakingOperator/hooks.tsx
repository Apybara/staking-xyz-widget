import type { Network } from "../../types";
import * as T from "./types";
import { useEffect, useState } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import {
  useCelestiaDelegations,
  useCelestiaUnbondingDelegations,
  useCelestiaAddressActivity,
  useCelestiaAddressRewardsHistory,
  useCelestiaReward,
  useCelestiaAddressRewards,
  useCelestiaStatus,
  useCelestiaServerStatus,
} from "../stakingOperator/celestia/hooks";

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
  const { network } = useShell();
  const { address } = useWallet();

  useEffect(() => {
    if (offset !== 0) {
      setOffset(0);
    }
  }, [filterKey, limit, address, network]);

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
  const celestia = useCelestiaAddressActivity({
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

export const useLastOffsetActivity = ({
  limit,
  filterKey,
  lastOffset,
}: Omit<T.AddressActivityPaginationParams, "offset"> & { lastOffset: number }) => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = useCelestiaAddressActivity({
    network,
    address: address || undefined,
    offset: lastOffset,
    limit,
    filterKey,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    default:
      return undefined;
  }
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

export const useAddressRewards = () => {
  const { network } = useShell();
  const { address } = useWallet();

  const celestia = useCelestiaAddressRewards({
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
  const celestia = useCelestiaAddressRewardsHistory({
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

export const useNetworkReward = (args?: { defaultNetwork?: Network; amount?: string }) => {
  const { defaultNetwork, amount } = args || {};
  const { network } = useShell();
  const castedNetwork = defaultNetwork || network;

  const celestiaRewards = useCelestiaReward({ network: castedNetwork, amount: amount || "0" });

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
