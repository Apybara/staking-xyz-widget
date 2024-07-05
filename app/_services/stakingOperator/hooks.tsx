import type { Network } from "../../types";
import * as T from "./types";
import { useEffect, useState } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { getIsCelestia, getIsCosmosHub } from "./cosmos";
import { getIsAleoNetwork } from "../aleo/utils";
import * as cosmos from "../stakingOperator/cosmos/hooks";
import * as aleo from "../stakingOperator/aleo/hooks";

export const useUnbondingDelegations = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = cosmos.useCosmosUnbondingDelegations({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
  });
  const cosmoshub = cosmos.useCosmosUnbondingDelegations({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshub;
    default:
      return undefined;
  }
};

export const useExternalDelegations = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = cosmos.useCosmosExternalDelegations({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
  });
  const cosmoshub = cosmos.useCosmosExternalDelegations({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshub;
    default:
      return undefined;
  }
};

export const useStakedBalance = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestiaData = cosmos.useCosmosDelegations({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
  });
  const cosmoshubData = cosmos.useCosmosDelegations({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
  });
  const aleoData = aleo.useAleoAddressStakedBalance({
    network: getIsAleoNetwork(network) ? network : null,
    address: address || "",
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaData;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshubData;
    case "aleo":
      return aleoData;
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
  const celestia = cosmos.useCosmosAddressActivity({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
    offset,
    limit,
    filterKey,
  });
  const cosmoshub = cosmos.useCosmosAddressActivity({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
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
    case "cosmoshub":
    case "cosmoshubtestnet":
      return {
        params: { offset, setOffset, limit, filterKey, setFilterKey },
        query: cosmoshub,
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
  const celestia = cosmos.useCosmosAddressActivity({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
    offset: lastOffset,
    limit,
    filterKey,
  });
  const cosmoshub = cosmos.useCosmosAddressActivity({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
    offset: lastOffset,
    limit,
    filterKey,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return celestia;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshub;
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

  const celestia = cosmos.useCosmosAddressRewards({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
  });
  const cosmoshub = cosmos.useCosmosAddressRewards({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
  });

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
      return {
        query: celestia,
      };
    case "cosmoshub":
    case "cosmoshubtestnet":
      return {
        query: cosmoshub,
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
  const celestia = cosmos.useCosmosAddressRewardsHistory({
    network,
    address: address && getIsCelestia(network) ? address : undefined,
    offset,
    limit,
  });
  const cosmoshub = cosmos.useCosmosAddressRewardsHistory({
    network,
    address: address && getIsCosmosHub(network) ? address : undefined,
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
    case "cosmoshub":
    case "cosmoshubtestnet":
      return {
        params: { offset, setOffset, limit },
        query: cosmoshub,
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

  const celestiaRewards = cosmos.useCosmosReward({
    network: getIsCelestia(castedNetwork) ? castedNetwork : null,
    amount: amount || "0",
  });
  const cosmoshubRewards = cosmos.useCosmosReward({
    network: getIsCosmosHub(castedNetwork) ? castedNetwork : null,
    amount: amount || "0",
  });

  switch (castedNetwork) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaRewards;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshubRewards;
    default:
      return undefined;
  }
};

export const useNetworkStatus = (defaultNetwork?: string) => {
  const { network } = useShell();
  const celestiaStatus = cosmos.useCosmosStatus({ network: getIsCelestia(network) ? network : null });
  const cosmoshubStatus = cosmos.useCosmosStatus({ network: getIsCosmosHub(network) ? network : null });
  const aleoStatus = aleo.useAleoStatus({ network: getIsAleoNetwork(network) ? network : null });

  switch (defaultNetwork || network) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaStatus;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshubStatus;
    case "aleo":
      return aleoStatus;
    default:
      return undefined;
  }
};

export const useServerStatus = (defaultNetwork?: string) => {
  const { network } = useShell();
  const celestiaStatus = cosmos.useCosmosServerStatus({ network: getIsCelestia(network) ? network : null });
  const cosmoshubStatus = cosmos.useCosmosServerStatus({ network: getIsCosmosHub(network) ? network : null });
  const aleoStatus = aleo.useAleoServerStatus({ network: getIsAleoNetwork(network) ? network : null });

  switch (defaultNetwork || network) {
    case "celestia":
    case "celestiatestnet3":
      return celestiaStatus;
    case "cosmoshub":
    case "cosmoshubtestnet":
      return cosmoshubStatus;
    case "aleo":
      return aleoStatus;
    default:
      return undefined;
  }
};
