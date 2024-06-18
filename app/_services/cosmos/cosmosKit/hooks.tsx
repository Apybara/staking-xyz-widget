import type { ChainWalletContext } from "@cosmos-kit/core";
import type { WalletStates } from "../../../_contexts/WalletContext/types";
import type { Network, CosmosNetwork, WalletType } from "../../../types";
import type { UseWalletBalanceGettersProps } from "../../wallet/types";
import type { GetBalanceProps } from "../types";
import type { CosmosKitWalletType } from "./types";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChainWallet, useChain } from "@cosmos-kit/react-lite";
import { useDialog } from "../../../_contexts/UIContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { getBalance } from "..";
import { cosmosTestnetChainInfo } from "../consts";
import { getIsCosmosNetwork, getIsCosmosTestnet } from "../utils";
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

export const useCosmosKitError = ({
  network,
  walletType,
  modalOpen,
  keplrSuggestConnectError,
}: {
  network?: Network | null;
  walletType: WalletType | null;
  modalOpen: boolean;
  keplrSuggestConnectError?: boolean;
}) => {
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const { status, wallet, openView, closeView } = useChain(isCosmosNetwork ? network : "celestia");

  // Need to trigger modal open/close to reset CosmosKit status
  useEffect(() => {
    if (!modalOpen) {
      closeView();
      return;
    }
    openView();
  }, [modalOpen]);

  if (!isCosmosNetwork || !getIsCosmosKitWalletType(walletType || "")) return null;
  if (wallet?.name === "keplr-extension" && getIsCosmosTestnet(network)) {
    return keplrSuggestConnectError === true;
  } else {
    return status === "Error" || status === "Rejected";
  }
};

export const useCosmosKitConnectors = (network: CosmosNetwork) => {
  const walletContexts = useCosmosKitWalletContexts(network);
  const keplrConnect = useKeplrSuggestAndConnect({ network, keplrConnect: walletContexts?.keplr?.connect || null });
  const keplrMobileConnect = walletContexts?.keplrMobile?.connect || null;
  const leapConnect = walletContexts?.leap?.connect || null;
  const leapMobileConnect = walletContexts?.leapMobile?.connect || null;
  const okxConnect = walletContexts?.okx?.connect || null;

  return {
    keplr: keplrConnect,
    keplrMobile: keplrMobileConnect,
    leap: leapConnect,
    leapMobile: leapMobileConnect,
    okx: okxConnect,
  } as Record<CosmosKitWalletType, ChainWalletContext["connect"] | null>;
};

export const useCosmosKitDisconnector = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { disconnect } = useChain(network);
  return disconnect;
};

export const useCosmosKitWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { status, wallet, address } = useChain(network);
  useCosmosKitConnectionEvents({ network });

  const walletName = useMemo<WalletStates["activeWallet"]>(() => {
    if (wallet?.name === "keplr-extension") return "keplr";
    if (wallet?.name === "keplr-mobile") return "keplrMobile";
    if (wallet?.name === "leap-extension") return "leap";
    if (wallet?.name === "leap-cosmos-mobile") return "leapMobile";
    if (wallet?.name === "okxwallet-extension") return "okx";
    return null;
  }, [wallet]);

  const connectionStatus = useMemo<WalletStates["connectionStatus"]>(() => {
    switch (status) {
      case "Connected":
        if (!walletName || !address) return "disconnected";
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
  }, [status, walletName, address]);

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

const useKeplrSuggestAndConnect = ({
  network,
  keplrConnect,
}: {
  network: CosmosNetwork;
  keplrConnect: (() => Promise<void>) | null;
}) => {
  const { setStates } = useWallet();
  const { open } = useDialog("walletConnection");

  useEffect(() => {
    if (getIsCosmosTestnet(network) === false || !open) {
      setStates?.({ keplrSuggestConnectError: undefined });
      return;
    }
  }, [network, open, setStates]);

  if (!getIsCosmosTestnet(network)) return keplrConnect;

  return async () => {
    if (!window?.keplr) throw new Error("Keplr not found");

    try {
      setStates({ activeWallet: "keplr", connectionStatus: "connecting", keplrSuggestConnectError: undefined });

      await window?.keplr?.experimentalSuggestChain(cosmosTestnetChainInfo[network]);
      await keplrConnect?.();

      setStates({ activeWallet: "keplr", connectionStatus: "connected", keplrSuggestConnectError: undefined });
    } catch (error) {
      setStates({ activeWallet: "keplr", connectionStatus: "disconnected", keplrSuggestConnectError: true });
    }
  };
};

const useCosmosKitConnectionEvents = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const walletContexts = useCosmosKitWalletContexts(network);
  const keplrConnect = walletContexts?.keplr?.connect || null;
  const leapConnect = walletContexts?.leap?.connect || null;
  const okxConnect = walletContexts?.okx?.connect || null;
  const okxDisconnect = walletContexts?.okx?.disconnect || null;

  // Keplr account change event
  useEffect(() => {
    if (!window?.keplr) return;

    window.addEventListener("keplr_keystorechange", keplrConnect || (() => null));
    return () => {
      window.removeEventListener("keplr_keystorechange", keplrConnect || (() => null));
    };
  }, [keplrConnect]);

  // Leap account change event
  useEffect(() => {
    if (!window?.leap) return;

    window.addEventListener("leap_keystorechange", leapConnect || (() => null));
    return () => {
      window.removeEventListener("leap_keystorechange", leapConnect || (() => null));
    };
  }, [leapConnect]);

  // Okx account change event
  useEffect(() => {
    // @ts-ignore
    if (!window?.okxwallet?.keplr) return;
    // @ts-ignore
    window.okxwallet?.keplr.on("accountChanged", (addressInfo: any) => {
      if (addressInfo?.account) {
        okxConnect?.();
      } else {
        okxDisconnect?.();
      }
    });
  }, [okxConnect, okxDisconnect]);
};

const useCosmosKitWalletContexts = (network: CosmosNetwork) => {
  const keplrContext = useChainWallet(network, "keplr-extension");
  const keplrMobileContext = useChainWallet(network, "keplr-mobile");
  const leapContext = useChainWallet(network, "leap-extension");
  const leapMobileContext = useChainWallet(network, "leap-cosmos-mobile");
  const okxContext = useChainWallet(network, "okxwallet-extension");

  return {
    keplr: keplrContext,
    keplrMobile: keplrMobileContext,
    leap: leapContext,
    leapMobile: leapMobileContext,
    okx: okxContext,
  } as Record<CosmosKitWalletType, ChainWalletContext | undefined>;
};
