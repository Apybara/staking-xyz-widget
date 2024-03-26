import type { Network } from "../../types";
import { useWidget } from "../WidgetContext";
import { getIsCosmosNetwork } from "../../_services/cosmosKit";
import { useCosmosKitWalletSupports, useCosmosWalletStates } from "../../_services/cosmosKit/hooks";

export const useWalletsSupport = (network?: Network) => {
  const {
    keplr: isKeplrSupported,
    keplrMobile: isKeplrMobileSupported,
    leap: isLeapSupported,
    leapMobile: isLeapMobileSupported,
    okx: isOkxSupported,
  } = useCosmosKitWalletSupports(network || "celestia");

  return {
    keplr: isKeplrSupported,
    keplrMobile: isKeplrMobileSupported,
    leap: isLeapSupported,
    leapMobile: isLeapMobileSupported,
    okx: isOkxSupported,
  };
};

export const useActiveWalletStates = () => {
  const { network } = useWidget();
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  if (isCosmosNetwork) return cosmosWalletStates;
  return null;
};
