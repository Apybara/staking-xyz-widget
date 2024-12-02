"use client";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsCosmosNetwork } from "@/app/_services/cosmos/utils";
import { WarningBannerAndDialog } from "../WarningBannerAndDialog";

export const DiscontinuingSupport = () => {
  const { network } = useShell();

  return (
    <WarningBannerAndDialog
      active={!!(network && getIsCosmosNetwork(network))}
      title="Discontinuing support"
      subtitle="Discontinuing support"
      message="Please note that Staking.xyz will discontinue support for Cosmos Hub and Celestia on December 9. You can
              manage your staking positions using Keplr or Leap wallet."
    />
  );
};
