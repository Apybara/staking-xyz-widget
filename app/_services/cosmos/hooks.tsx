import type { CosmosNetwork, CosmosWalletType } from "../../types";
import useLocalStorage from "use-local-storage";
import { getIsCosmosKitWalletType } from "./cosmosKit/utils";
import { useGrazConnectors, useGrazDisconnector, useGrazWalletBalance, useGrazWalletStates } from "./graz/hooks";
import { cosmosNetworkVariants } from "../../consts";
import {
  useCosmosKitConnectors,
  useCosmosKitDisconnector,
  useCosmosKitWalletBalance,
  useCosmosKitWalletStates,
  useCosmosKitWalletSupports,
} from "./cosmosKit/hooks";

export const useCosmosWalletHasStoredConnection = () => {
  const [cosmosKitStorage] = useLocalStorage<
    Array<{
      address: string;
      chainId: string;
      namespace: string;
      username: string;
    }>
  >("cosmos-kit@2:core//accounts", []);
  const [grazStorage] = useLocalStorage<{
    state: {
      recentChainIds: Array<string> | null;
      _reconnect: boolean | null;
      _reconnectConnector: string | null;
    };
  }>("graz-internal", { state: { recentChainIds: null, _reconnect: null, _reconnectConnector: null } });

  const isCosmosKitStored = cosmosKitStorage?.some((s) => cosmosNetworkVariants.some((v) => v === s.chainId));
  const isGrazStored = grazStorage?.state?._reconnectConnector !== null;

  return isCosmosKitStored || isGrazStored;
};

export const useCosmosWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const cosmosKitStates = useCosmosKitWalletStates({ network });
  const grazStates = useGrazWalletStates({ network });

  if (grazStates.activeWallet && grazStates.address) {
    return grazStates;
  }
  if (cosmosKitStates.activeWallet && cosmosKitStates.address) {
    return cosmosKitStates;
  }
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

export const useCosmosWalletSupports = () => {
  const { keplr: isKeplrSupported, leap: isLeapSupported, okx: isOkxSupported } = useCosmosKitWalletSupports();

  return {
    keplr: isKeplrSupported,
    keplrMobile: true,
    leap: isLeapSupported,
    leapMobile: true,
    okx: isOkxSupported,
    walletConnect: true,
  } as Record<CosmosWalletType, boolean>;
};
