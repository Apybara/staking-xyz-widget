"use client";

import numbro from "numbro";
import { RootFooter } from "./RootFooter";
import { useNetworkStatus } from "@/app/_services/stakingOperator/hooks";

export const Footer = () => {
  const { data, isLoading, error } = useNetworkStatus() || {};

  const isNetworkOffline = data?.networkOffline;
  const isError = error || isNetworkOffline;

  const errorMessage = isNetworkOffline ? "Celestia has problem" : "Connection problem";

  const formattedBlockHeight = numbro(data?.blockHeight).format({
    thousandSeparated: true,
    mantissa: 0,
  });

  return (
    <RootFooter
      networkStatus={isLoading ? "loading" : isError ? "error" : "default"}
      blockHeight={isLoading ? "Checking.." : isError ? errorMessage : formattedBlockHeight}
    />
  );
};
