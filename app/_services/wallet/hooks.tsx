import type { CosmosNetwork, CosmosWalletType } from "../../types";
import type { UseWalletConnectors, UseWalletDisconnectors, UseWalletBalanceGettersProps } from "./types";
import { useState, useEffect } from "react";
import { useDialog } from "../../_contexts/UIContext";
import { useWallet } from "../../_contexts/WalletContext";
import { getIsCosmosNetwork, getIsCosmosWalletType } from "../cosmos/utils";
import {
  useCosmosWalletBalance,
  useCosmosWalletConnectors,
  useCosmosWalletDisconnectors,
  useCosmosWalletHasStoredConnection,
} from "../cosmos/hooks";

export const useWalletConnectors: UseWalletConnectors = (network) => {
  const isCosmosNetwork = getIsCosmosNetwork(network);
  const cosmosConnectors = useCosmosWalletConnectors({
    network: isCosmosNetwork ? (network as CosmosNetwork) : undefined,
  });

  return {
    ...cosmosConnectors,
  };
};

export const useWalletDisconnectors: UseWalletDisconnectors = (network) => {
  const isCosmosNetwork = getIsCosmosNetwork(network);
  const cosmosDisconnectors = useCosmosWalletDisconnectors({
    network: isCosmosNetwork ? (network as CosmosNetwork) : undefined,
  });

  return {
    ...cosmosDisconnectors,
  };
};

export const useWalletBalance = ({ address, network, activeWallet }: UseWalletBalanceGettersProps) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const isCosmosWalletType = getIsCosmosWalletType(activeWallet || "");
  const cosmosBalance = useCosmosWalletBalance({
    address,
    network,
    activeWallet: isCosmosWalletType ? (activeWallet as CosmosWalletType) : null,
  });

  if (isCosmosNetwork) return cosmosBalance;
};

export const useIsWalletConnectingEagerly = () => {
  const { connectionStatus, activeWallet } = useWallet();
  const { open } = useDialog("walletConnection");
  const isCosmosWalletStored = useCosmosWalletHasStoredConnection();
  const [isConnectingEagerly, setIsConnectingEagerly] = useState(false);

  useEffect(() => {
    if (isCosmosWalletStored && !open && connectionStatus === "connecting" && activeWallet && !isConnectingEagerly) {
      setIsConnectingEagerly(true);
    }
  }, [activeWallet, connectionStatus, open, isCosmosWalletStored]);

  useEffect(() => {
    if (connectionStatus === "connected" && isConnectingEagerly) {
      setIsConnectingEagerly(false);
    }
  }, [connectionStatus]);

  return isConnectingEagerly;
};
