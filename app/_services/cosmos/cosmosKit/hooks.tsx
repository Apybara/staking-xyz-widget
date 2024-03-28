import type { ChainWalletContext } from "@cosmos-kit/core";
import type { WalletStates } from "../../../_contexts/WalletContext/types";
import type { Network, CosmosNetwork } from "../../../types";
import type { GetBalanceProps } from "../types";
import type { UseWalletBalanceGettersProps } from "../../wallet/types";
import type { CosmosKitWalletType } from "./types";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChainWallet, useChain } from "@cosmos-kit/react-lite";
import { getBalance } from "..";
import { getIsCosmosNetwork } from "../utils";
import { getIsCosmosKitWalletType } from "./utils";

export const useCosmosKitWalletSupports = () => {
  const [keplr, setKeplr] = useState(null);
  const [leap, setLeap] = useState(null);
  const [okx, setOkx] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // @ts-ignore
    setKeplr(!!window.keplr);
    // @ts-ignore
    setLeap(!!window.leap);
    // @ts-ignore
    setOkx(!!window.okxwallet);
  }, []);

  return {
    keplr: keplr === true,
    leap: leap === true,
    okx: okx === true,
  } as Record<CosmosKitWalletType, boolean>;
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

export const useCosmosKitConnectors = (network: CosmosNetwork) => {
  const walletContexts = useCosmosKitWalletContexts(network);
  const keplrConnect = walletContexts?.keplr?.connect || null;
  const leapConnect = walletContexts?.leap?.connect || null;
  const okxConnect = walletContexts?.okx?.connect || null;

  return {
    keplr: keplrConnect,
    leap: leapConnect,
    okx: okxConnect,
  } as Record<CosmosKitWalletType, ChainWalletContext["connect"] | null>;
};

export const useCosmosKitDisconnector = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { disconnect } = useChain(network);
  return disconnect;
};

export const useCosmosKitWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
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

export const useCosmosKitWalletBalance = ({ address, network, activeWallet }: UseWalletBalanceGettersProps) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const isCosmosKitWallet = getIsCosmosKitWalletType(activeWallet || "");
  const cosmosProps = useCosmosKitBalanceProps({
    address,
    network: isCosmosNetwork ? (network as CosmosNetwork) : "celestia",
    activeWallet,
  });

  const { data, isLoading, error } = useQuery({
    enabled: isCosmosKitWallet && isCosmosNetwork && !!activeWallet && !!address,
    queryKey: ["cosmosKitWalletBalance", address, network],
    queryFn: () => getBalance(cosmosProps),
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  return {
    isLoading,
    error,
    data,
  };
};

const useCosmosKitBalanceProps = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: CosmosNetwork;
  activeWallet: WalletStates["activeWallet"];
}): GetBalanceProps => {
  const walletContexts = useCosmosKitWalletContexts(network);
  if (!activeWallet || !getIsCosmosKitWalletType(activeWallet)) {
    return { getRpcEndpoint: null, address: null, network };
  }

  const getRpcEndpoint = walletContexts?.[activeWallet]?.getRpcEndpoint;
  return {
    getRpcEndpoint: getRpcEndpoint || null,
    address: address || null,
    network,
  };
};

const useCosmosKitWalletContexts = (network: CosmosNetwork) => {
  const keplrContext = useChainWallet(network, "keplr-extension");
  const leapContext = useChainWallet(network, "leap-extension");
  const okxContext = useChainWallet(network, "okxwallet-extension");

  return {
    keplr: keplrContext,
    leap: leapContext,
    okx: okxContext,
  } as Record<CosmosKitWalletType, ChainWalletContext | undefined>;
};
