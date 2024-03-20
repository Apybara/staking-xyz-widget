import type { CosmosNetwork } from "../../types";
import type {
  UseWalletConnectors,
  UseWalletDisconnectors,
  UseWalletBalanceGetters,
  UseWalletBalanceGettersProps,
} from "./types";
import { useQuery } from "@tanstack/react-query";
import { cosmosNetworkVariants } from "../../consts";
import { getBalance } from "../cosmos";
import { useCosmosKitConnectors, useCosmosKitDisconnector, useCosmosKitBalanceProps } from "../cosmosKit/hooks";

export const useWalletConnectors: UseWalletConnectors = (network) => {
  const isCosmosNetwork = cosmosNetworkVariants.some((variant) => variant === network);
  const { keplr: keplrConnect, leap: leapConnect } = useCosmosKitConnectors(
    isCosmosNetwork ? (network as CosmosNetwork) : "celestia",
  );

  return {
    keplr: keplrConnect,
    leap: leapConnect,
  };
};

export const useWalletDisconnectors: UseWalletDisconnectors = (network) => {
  const disconnect = useCosmosKitDisconnector({ network });

  return {
    keplr: disconnect,
    leap: disconnect,
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
  const isCosmosNetwork = cosmosNetworkVariants.some((variant) => variant === network);
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
