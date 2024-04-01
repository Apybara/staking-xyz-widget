import type { CosmosNetwork, CosmosWalletType } from "../../types";
import type { UseWalletConnectors, UseWalletDisconnectors, UseWalletBalanceGettersProps } from "./types";
import { getIsCosmosNetwork, getIsCosmosWalletType } from "../cosmos/utils";
import { useCosmosWalletBalance, useCosmosWalletConnectors, useCosmosWalletDisconnectors } from "../cosmos/hooks";

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
