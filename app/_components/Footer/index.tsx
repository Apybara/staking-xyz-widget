"use client";

import numbro from "numbro";
import { RootFooter } from "./RootFooter";
import { useNetworkStatus, useServerStatus } from "@/app/_services/stakingOperator/hooks";
import { useShell } from "@/app/_contexts/ShellContext";
import { networkInfo } from "@/app/consts";

export const Footer = () => {
  const { network } = useShell();
  const networkName = networkInfo[network as keyof typeof networkInfo]?.name;

  const {
    data: networkStatusData,
    isLoading: isLoadingNetworkStatus,
    isRefetching: isRefetchingNetworkStatus,
    error: networkStatusError,
  } = useNetworkStatus() || {};
  const {
    data: serverStatusData,
    isLoading: isLoadingServerStatus,
    isRefetching: isRefetchingServerStatus,
    error: serverStatusError,
  } = useServerStatus() || {};

  const isNetworkOffline = networkStatusData?.networkOffline;
  const isServerDown = serverStatusData?.statusCode !== 200;

  const isLoading = isLoadingNetworkStatus || isLoadingServerStatus;
  const isError = networkStatusError || serverStatusError || isNetworkOffline || isServerDown;
  const isRefetching = isRefetchingNetworkStatus || isRefetchingServerStatus;

  const errorMessage = isNetworkOffline
    ? `${networkName} has a problem`
    : isServerDown
      ? "Our server has a problem"
      : "An error has occured";

  const formattedBlockHeight = numbro(networkStatusData?.blockHeight).format({
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
