import type { CosmosNetwork, CosmosWalletType, AleoNetwork, AleoWalletType } from "../../types";
import type { UseWalletConnectors, UseWalletDisconnectors, UseWalletBalanceGettersProps } from "./types";
import { getIsCosmosNetwork, getIsCosmosWalletType } from "../cosmos/utils";
import { useCosmosWalletBalance, useCosmosWalletConnectors, useCosmosWalletDisconnectors } from "../cosmos/hooks";
import { getIsAleoNetwork, getIsAleoWalletType } from "../aleo/utils";
import { useAleoWalletConnectors, useAleoWalletDisconnectors, useAleoWalletBalance } from "../aleo/hooks";

export const useWalletConnectors = () => {
  // const isCosmosNetwork = getIsCosmosNetwork(network);
  // const cosmosConnectors = useCosmosWalletConnectors({
  //   network: isCosmosNetwork ? (network as CosmosNetwork) : undefined,
  // });
  const aleoConnectors = useAleoWalletConnectors();

  return {
    // ...cosmosConnectors,
    ...aleoConnectors,
  };
};

export const useWalletDisconnectors = () => {
  // const isCosmosNetwork = getIsCosmosNetwork(network);
  // const cosmosDisconnectors = useCosmosWalletDisconnectors({
  //   network: isCosmosNetwork ? (network as CosmosNetwork) : undefined,
  // });
  const aleoDisconnectors = useAleoWalletDisconnectors();

  return {
    // ...cosmosDisconnectors,
    ...aleoDisconnectors,
  };
};

export const useWalletBalance = ({ address, network, activeWallet }: UseWalletBalanceGettersProps) => {
  // const isCosmosNetwork = getIsCosmosNetwork(network || "");
  // const isCosmosWalletType = getIsCosmosWalletType(activeWallet || "");
  // const cosmosBalance = useCosmosWalletBalance({
  //   address,
  //   network: isCosmosNetwork ? (network as CosmosNetwork) : null,
  //   activeWallet: isCosmosWalletType ? (activeWallet as CosmosWalletType) : null,
  // });

  const isAleoNetwork = getIsAleoNetwork(network || "");
  const isAleoWalletType = getIsAleoWalletType(activeWallet || "");
  const aleoBalance = useAleoWalletBalance({
    address,
    network: isAleoNetwork ? (network as AleoNetwork) : null,
    activeWallet: isAleoWalletType ? (activeWallet as AleoWalletType) : null,
  });

  // if (isCosmosNetwork) return cosmosBalance;
  if (isAleoNetwork) return aleoBalance;
};
