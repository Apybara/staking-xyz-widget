import BigNumber from "bignumber.js";
import { useQuery } from "@tanstack/react-query";
import * as T from "./types";
import { getPondoData } from ".";
import { aleoRestUrl } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "../utils";

export const usePondoData = (): T.PondoDataResponse | null => {
  const { network, stakingType } = useShell();
  const isAleoNetwork = getIsAleoNetwork(network || "");
  const shouldEnable = isAleoNetwork && stakingType === "liquid";

  const { data, isLoading } = useQuery({
    enabled: shouldEnable,
    queryKey: ["pondoData"],
    queryFn: () => {
      if (!shouldEnable) return null;
      return getPondoData({ apiUrl: aleoRestUrl });
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  if (!data) return null;

  return {
    mintRate: BigNumber(data.protocolBalance || "1")
      .dividedBy(data.paleoSupply || "1")
      .toNumber(),
    isLoading,
    isRebalancing: data.protocolState === "1" || data.protocolState === "2",
  };
};
