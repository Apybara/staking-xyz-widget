import type { CosmosNetwork, CosmosWalletType } from "../../types";
import { getIsCosmosKitWalletType } from "./cosmosKit/utils";
import { useGrazConnectors, useGrazDisconnector, useGrazWalletBalance, useGrazWalletStates } from "./graz/hooks";
import {
  useCosmosKitConnectors,
  useCosmosKitDisconnector,
  useCosmosKitWalletBalance,
  useCosmosKitWalletStates,
  useCosmosKitWalletSupports,
} from "./cosmosKit/hooks";

export const useCosmosWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const cosmosKitStates = useCosmosKitWalletStates({ network });
  const grazStates = useGrazWalletStates({ network });

  return cosmosKitStates.activeWallet ? cosmosKitStates : grazStates;
};

export const useCosmosWalletBalance = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: CosmosNetwork | null;
  activeWallet: CosmosWalletType | null;
}) => {
  const cosmosKitBalance = useCosmosKitWalletBalance({ address, network, activeWallet });
  const grazBalance = useGrazWalletBalance({ address, network, activeWallet });

  if (!activeWallet) {
    return null;
  }
  if (getIsCosmosKitWalletType(activeWallet)) {
    return cosmosKitBalance;
  }
  return grazBalance;
};

export const useCosmosWalletConnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { keplr: keplrConnect, leap: leapConnect, okx: okxConnect } = useCosmosKitConnectors(network);
  const { keplrMobile, leapMobile, walletConnect } = useGrazConnectors(network);

  return {
    keplr: keplrConnect,
    keplrMobile,
    leap: leapConnect,
    leapMobile,
    okx: okxConnect,
    walletConnect,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletDisconnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const disconnectCosmosKit = useCosmosKitDisconnector({ network });
  const disconnectGraz = useGrazDisconnector({ network });

  return {
    keplr: disconnectCosmosKit,
    keplrMobile: disconnectGraz,
    leap: disconnectCosmosKit,
    leapMobile: disconnectGraz,
    okx: disconnectCosmosKit,
    walletConnect: disconnectGraz,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletSupports = (network: CosmosNetwork) => {
  const { keplr: isKeplrSupported, leap: isLeapSupported, okx: isOkxSupported } = useCosmosKitWalletSupports(network);

  return {
    keplr: isKeplrSupported,
    keplrMobile: true,
    leap: isLeapSupported,
    leapMobile: true,
    okx: isOkxSupported,
    walletConnect: true,
  } as Record<CosmosWalletType, boolean>;
};
