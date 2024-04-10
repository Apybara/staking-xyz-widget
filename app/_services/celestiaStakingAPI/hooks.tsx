import type { UnbondingDelegation } from "../unstake/types";
import type { DelegationResponseItem, UnbondingDelegationResponseItem } from "./types";
import moment from "moment";
import BigNumber from "bignumber.js";
import { useQuery } from "@tanstack/react-query";
import { getCoinValueFromDenom } from "../../_services/cosmos/utils";
import { getAddressAuthCheck, getDelegations, getUnbondingDelegations } from ".";

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

const useStakedBalance = ({ delegations }: { delegations?: Array<DelegationResponseItem> }) => {
  if (delegations === undefined) return undefined;
  if (!delegations?.length) return "0";

  const amount = delegations.reduce((acc, { balance }) => {
    return acc.plus(balance.amount);
  }, BigNumber(0));

  return getCoinValueFromDenom({ network: "celestia", amount: amount.toString() });
};

const useFormattedUnbondingDelegations = (
  delegations?: Array<UnbondingDelegationResponseItem>,
): Array<UnbondingDelegation> => {
  const formattedDelegations: Array<UnbondingDelegation> = [];

  delegations?.forEach((delegation) => {
    delegation.entries.forEach((entry) => {
      formattedDelegations.push({
        validatorAddress: delegation.validator_address,
        remainingDays: moment(entry.completion_time).diff(moment.now(), "days"),
        amount: getCoinValueFromDenom({ network: "celestia", amount: entry.balance }),
      });
    });
  });

  return formattedDelegations;
};
