"use client";
import { usePathname } from "next/navigation";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsCosmosNetwork } from "@/app/_services/cosmos/utils";
import { WarningBannerAndDialog } from "../WarningBannerAndDialog";

export const DiscontinuingSupport = () => {
  const { network } = useShell();
  const pathname = usePathname();

  return (
    <WarningBannerAndDialog
      active={!!(pathname === "/stake" && network && getIsCosmosNetwork(network))}
      title="Discontinuing support"
      subtitle="Discontinuing support"
      message="Please note that Staking.xyz will discontinue support for Cosmos Hub and Celestia on November 29. You can
              manage your staking positions using Keplr or Leap wallet."
    />
  );
};
