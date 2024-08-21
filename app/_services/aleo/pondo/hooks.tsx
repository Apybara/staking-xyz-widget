import BigNumber from "bignumber.js";
import { useQuery } from "@tanstack/react-query";
import { getPondoData } from ".";
import { networkEndpoints } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "../utils";

export const usePondoData = () => {
  const { network, stakingType } = useShell();
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const shouldEnable = isAleoNetwork && stakingType === "liquid";

  const { data, isLoading, refetch } = useQuery({
    enabled: shouldEnable,
    queryKey: ["pondoData"],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getPondoData({ apiUrl: networkEndpoints.aleo.rpc });
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  if (!data) return null;

  const pAleoToAleoRate = BigNumber(data.pondoTVL || "1")
    .dividedBy(data.paleoSupply || "1")
    .toNumber();
  const aleoToPAleoRate = 1 / pAleoToAleoRate;

  return {
    pAleoToAleoRate,
    aleoToPAleoRate,
    isLoading,
    isRebalancing: data.protocolState === "1" || data.protocolState === "2",
    refetch,
  };
};
