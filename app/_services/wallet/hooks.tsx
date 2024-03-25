import type { CosmosNetwork } from "../../types";
import type {
  UseWalletConnectors,
  UseWalletDisconnectors,
  UseWalletBalanceGetters,
  UseWalletBalanceGettersProps,
} from "./types";
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "../cosmos";
import { getIsCosmosNetwork } from "../cosmosKit";
import { useCosmosKitConnectors, useCosmosKitDisconnector, useCosmosKitBalanceProps } from "../cosmosKit/hooks";

export const useWalletConnectors: UseWalletConnectors = (network) => {
  const isCosmosNetwork = getIsCosmosNetwork(network);
  const {
    keplr: keplrConnect,
    leap: leapConnect,
    okx: okxConnect,
  } = useCosmosKitConnectors(isCosmosNetwork ? (network as CosmosNetwork) : "celestia");

  return {
    keplr: keplrConnect,
    leap: leapConnect,
    okx: okxConnect,
  };
};

export const useWalletDisconnectors: UseWalletDisconnectors = (network) => {
  const disconnect = useCosmosKitDisconnector({ network });

  return {
    keplr: disconnect,
    leap: disconnect,
    okx: disconnect,
  };
};

export const useWalletBalance = ({ address, network, activeWallet }: UseWalletBalanceGettersProps) => {
  const balanceGetters = useWalletBalanceGetters({ address, network: network || "celestia", activeWallet });
  const getBalance = balanceGetters[network || "celestia"];

  const { data, isLoading, error } = useQuery({
    queryKey: ["walletBalance", address, network],
    queryFn: getBalance,
    refetchOnWindowFocus: true,
  });

  return {
    isLoading,
    error,
    data,
  };
};

const useWalletBalanceGetters: UseWalletBalanceGetters = ({ address, network, activeWallet }) => {
  const isCosmosNetwork = getIsCosmosNetwork(network);
  const cosmosProps = useCosmosKitBalanceProps({
    address,
    network: isCosmosNetwork ? (network as CosmosNetwork) : "celestia",
    activeWallet,
  });

  return {
    celestia: async () => await getBalance(cosmosProps),
    "mocha-4": async () => await getBalance(cosmosProps),
  };
};
