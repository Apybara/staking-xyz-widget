import type { ChainWalletContext } from "@cosmos-kit/core";
import type { WalletStates } from "../../_contexts/WalletContext/types";
import type { Network, CosmosNetwork, CosmosWalletType } from "../../types";
import type { GetBalanceProps } from "../cosmos/types";
import { useEffect, useMemo } from "react";
import { useChainWallet, useChain } from "@cosmos-kit/react-lite";
import { getIsCosmosNetwork } from ".";

export const useCosmosKitWalletSupports = (network: CosmosNetwork): Record<CosmosWalletType, boolean> => {
  const { keplr: keplrContext, leap: leapContext, okx: okxContext } = useCosmosKitWalletContexts(network);

  return {
    keplr: keplrContext?.isWalletNotExist !== true,
    leap: leapContext?.isWalletNotExist !== true,
    okx: okxContext?.isWalletNotExist !== true,
  };
};

export const useCosmosKitError = ({ network, modalOpen }: { network?: Network | null; modalOpen: boolean }) => {
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const { status, openView, closeView } = useChain(isCosmosNetwork ? network : "celestia");

  // Need to trigger modal open/close to reset CosmosKit status
  useEffect(() => {
    if (!modalOpen) {
      closeView();
      return;
    }
    openView();
  }, [modalOpen]);

  if (!isCosmosNetwork) return null;
  return status === "Error" || status === "Rejected";
};

export const useCosmosKitConnectors = (
  network: CosmosNetwork,
): Record<CosmosWalletType, (() => Promise<void>) | null> => {
  const walletContexts = useCosmosKitWalletContexts(network);
  const keplrConnect = walletContexts?.keplr?.connect || null;
  const leapConnect = walletContexts?.leap?.connect || null;
  const okxConnect = walletContexts?.okx?.connect || null;

  return {
    keplr: keplrConnect,
    leap: leapConnect,
    okx: okxConnect,
  };
};

export const useCosmosKitDisconnector = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { disconnect } = useChain(network);
  return disconnect;
};

export const useCosmosWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { status, wallet, address } = useChain(network);

  const connectionStatus = useMemo<WalletStates["connectionStatus"]>(() => {
    switch (status) {
      case "Connected":
        return "connected";
      case "Connecting":
        return "connecting";
      case "Disconnected":
      case "Error":
      case "NotExist":
      case "Rejected":
        return "disconnected";
    }
    return "disconnected";
  }, [status]);

  const walletName = useMemo<WalletStates["activeWallet"]>(() => {
    if (wallet?.name === "keplr-extension") return "keplr";
    if (wallet?.name === "leap-extension") return "leap";
    if (wallet?.name === "okxwallet-extension") return "okx";
    return null;
  }, [wallet]);

  return {
    activeWallet: walletName,
    address: address || null,
    connectionStatus,
  };
};

export const useCosmosKitBalanceProps = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: CosmosNetwork;
  activeWallet: WalletStates["activeWallet"];
}): GetBalanceProps => {
  const walletContexts = useCosmosKitWalletContexts(network);
  const getRpcEndpoint = activeWallet ? walletContexts?.[activeWallet]?.getRpcEndpoint : null;

  return {
    getRpcEndpoint: getRpcEndpoint || null,
    address: address || null,
    network,
  };
};

const useCosmosKitWalletContexts = (
  network: CosmosNetwork,
): Record<CosmosWalletType, ChainWalletContext | undefined> => {
  const keplrContext = useChainWallet(network, "keplr-extension");
  const leapContext = useChainWallet(network, "leap-extension");
  const okxContext = useChainWallet(network, "okxwallet-extension");

  return {
    keplr: keplrContext,
    leap: leapContext,
    okx: okxContext,
  };
};
