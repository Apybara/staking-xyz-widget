import * as T from "./types";
import { useState } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import {
  useCelestiaDelegations,
  useCelestiaUnbondingDelegations,
  useAddressActivity,
} from "../stakingOperator/celestia/hooks";

export const useUnbondingDelegations = () => {
  const { network } = useShell();
  const { address } = useWallet();
  const celestia = useCelestiaUnbondingDelegations({
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

export const useAddressActivityQueryParams = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(6);
  const [filterKey, setFilterKey] = useState<T.AddressActivityPaginationParams["filterKey"]>(null);

  return {
    offset,
    setOffset,
    limit,
    setLimit,
    filterKey,
    setFilterKey,
  };
};

export const useActivity = () => {
  const { network } = useShell();
  const { address } = useWallet();

  const { offset, setOffset, limit, filterKey, setFilterKey } = useAddressActivityQueryParams();
  const celestia = useAddressActivity({
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
  const { address } = useWallet();
  const { lastOffset } = useAddressActivity({ address: address || undefined, offset, limit, filterKey });

  return useAddressActivity({ address: address || undefined, offset: lastOffset, limit, filterKey });
};
