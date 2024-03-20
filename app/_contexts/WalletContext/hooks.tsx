import type { Network } from "../../types";
import { useWidget } from "../WidgetContext";
import { cosmosNetworkVariants } from "../../consts";
import { useCosmosKitWalletSupports, useCosmosWalletStates } from "../../_services/cosmosKit/hooks";

export const useWalletsSupport = (network?: Network) => {
  const { keplr: isKeplrSupported, leap: isLeapSupported } = useCosmosKitWalletSupports(network || 'celestia')

  return {
    keplr: isKeplrSupported,
    leap: isLeapSupported,
  };
};

export const useActiveWalletStates = () => {
  const { network } = useWidget();
  const isCosmosNetwork = network && cosmosNetworkVariants.includes(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  if (isCosmosNetwork) return cosmosWalletStates;
  return null
};