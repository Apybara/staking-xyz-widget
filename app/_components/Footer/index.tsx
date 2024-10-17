"use client";

import { useEffect, useState } from "react";
import numbro from "numbro";
import { RootFooter } from "./RootFooter";
import { useNetworkStatus, useServerStatus } from "@/app/_services/stakingOperator/hooks";
import { useShell } from "@/app/_contexts/ShellContext";
import { networkInfo } from "@/app/consts";

export const Footer = () => {
  const { network } = useShell();
  const networkName = networkInfo[network as keyof typeof networkInfo]?.name;

  const [latestBlockHeight, setLatestBlockHeight] = useState("0");
  const [isRefetchingBlockHeight, setIsRefetchingBlockHeight] = useState<boolean | undefined>(false);
  const [isBlockHeightError, setIsBlockHeightError] = useState<boolean | Error>(false);

  const networkStatus = useNetworkStatus();
  const serverStatus = useServerStatus();

  const {
    data: networkStatusData,
    isLoading: isLoadingNetworkStatus,
    isRefetching: isRefetchingNetworkStatus,
    error: networkStatusError,
  } = networkStatus || {};

  const {
    data: serverStatusData,
    isLoading: isLoadingServerStatus,
    isRefetching: isRefetchingServerStatus,
    error: serverStatusError,
  } = serverStatus || {};

  const isNetworkOffline = networkStatusData?.networkOffline;
  const isServerDown = serverStatusData?.statusCode !== 200;

  const isLoading = isLoadingNetworkStatus || isLoadingServerStatus || !networkStatus || !serverStatus;
  const isError = networkStatusError || serverStatusError || isNetworkOffline || isServerDown;
  const isRefetching = isRefetchingNetworkStatus || isRefetchingServerStatus;

  useEffect(() => {
    (!latestBlockHeight || latestBlockHeight === "0") && setLatestBlockHeight(networkStatusData?.blockHeight);
    isRefetching === false && setIsRefetchingBlockHeight(false);
    isError === false && setIsBlockHeightError(false);

    const intervalId = setInterval(() => {
      setLatestBlockHeight(networkStatusData?.blockHeight);
      setIsRefetchingBlockHeight(isRefetching);
      setIsBlockHeightError(isError);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [networkStatusData?.blockHeight, isRefetching, isError]);

  const errorMessage = isNetworkOffline
    ? `${networkName} has a problem`
    : isServerDown
      ? "Our server has a problem"
      : "An error has occured";

  const formattedBlockHeight = numbro(latestBlockHeight).format({
    thousandSeparated: true,
    mantissa: 0,
  });

  return (
    <RootFooter
      isRefetching={isLoading || isRefetchingBlockHeight}
      networkStatus={isLoading ? "idle" : isBlockHeightError ? "error" : "default"}
      blockHeight={isLoading ? "Loading.." : isBlockHeightError ? errorMessage : formattedBlockHeight}
    />
  );
};
