import type { Network } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { serverUrlByNetwork } from "../../../consts";
import { getIsAleoNetwork } from "../../aleo/utils";
import { getServerStatus } from ".";

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
