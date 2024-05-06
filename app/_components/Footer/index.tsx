"use client";

import numbro from "numbro";
import { RootFooter } from "./RootFooter";
import { useNetworkStatus } from "@/app/_services/stakingOperator/hooks";
import { useShell } from "@/app/_contexts/ShellContext";

export const Footer = () => {
  const { network } = useShell();
  const { data, isLoading, isRefetching, error } = useNetworkStatus() || {};

  const isNetworkOffline = data?.networkOffline;
  const isError = error || isNetworkOffline;

  const errorMessage = isNetworkOffline ? `${network} has a problem` : "Our server has a problem";

  const formattedBlockHeight = numbro(data?.blockHeight).format({
    thousandSeparated: true,
    mantissa: 0,
  });

  return (
    <RootFooter
      isRefetching={isLoading || isRefetching}
      networkStatus={isLoading ? "idle" : isError ? "error" : "default"}
      blockHeight={isLoading ? "Loading.." : isError ? errorMessage : formattedBlockHeight}
    />
  );
};
