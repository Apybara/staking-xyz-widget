import type { CosmosNetwork } from "../../../types";
import type { UseWalletBalanceGettersProps } from "../../wallet/types";
import type { WalletStates } from "../../../_contexts/WalletContext/types";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fromBech32, toBech32 } from "@cosmjs/encoding";
import { useConnect, useDisconnect, useActiveWalletType, useAccount, WalletType, useStargateClient } from "graz";
import { useWallet } from "../../../_contexts/WalletContext";
import { getIsCosmosNetwork, getDenomUnitValue } from "../utils";
import { getIsGrazWalletType } from "./utils";
import { chainInfo } from "./consts";

export const useGrazConnectors = (network: CosmosNetwork) => {
  const { setStates } = useWallet();
  const { connectAsync } = useConnect({
    onLoading: () => {
      setStates({ connectionStatus: "connecting" });
    },
    onError: () => {
      setStates({
        connectionStatus: "disconnected",
      });
    },
  });

  return {
    keplrMobile: async () => {
      await connectAsync({
        chainId: chainInfo[network].chainId,
        walletType: WalletType.WC_KEPLR_MOBILE,
      });
    },
    leapMobile: async () => {
      await connectAsync({
        chainId: chainInfo[network].chainId,
        walletType: WalletType.WC_LEAP_MOBILE,
      });
    },
    walletConnect: async () => {
      await connectAsync({
        chainId: chainInfo[network].chainId,
        walletType: WalletType.WALLETCONNECT,
      });
    },
  };
};

export const useGrazDisconnector = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { disconnect } = useDisconnect();
  return () => disconnect({ chainId: [network] });
};

export const useGrazWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { walletType } = useActiveWalletType();
  const { isLoading: isDisconnecting } = useDisconnect();
  const { data: accounts, isConnecting, isConnected } = useAccount({ chainId: [network], multiChain: true });
  const address = accounts?.[network]?.bech32Address || null;

  const connectionStatus = useMemo<WalletStates["connectionStatus"]>(() => {
    if (isConnecting) return "connecting";
    if (isDisconnecting) return "disconnecting";
    if (isConnected && address) return "connected";
    return "disconnected";
  }, [isConnecting, isConnected, isDisconnecting, address]);

  const walletName = useMemo<WalletStates["activeWallet"]>(() => {
    if (!walletType) return null;

    if (walletType === WalletType.WALLETCONNECT) return "walletConnect";
    return null;
  }, [walletType]);

  return {
    activeWallet: walletName,
    address,
    connectionStatus,
  };
};

export const useGrazWalletBalance = ({ address, network, activeWallet }: UseWalletBalanceGettersProps) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const isGrazWallet = getIsGrazWalletType(activeWallet || "");

  const { data: clients } = useStargateClient({ chainId: [network || "celestia"], multiChain: true });
  const client = clients?.[network || "celestia"];

  const { data, isLoading, error, refetch } = useQuery({
    enabled: isCosmosNetwork && isGrazWallet && !!client && !!address,
    queryKey: ["grazWalletBalance", address, network],
    queryFn: async () =>
      await client?.getAllBalances(
        toBech32(chainInfo[network || "celestia"].bech32Config.bech32PrefixAccAddr, fromBech32(address!).data),
      ),
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const amount = !isLoading && !error && !data?.[0]?.amount ? "0" : data?.[0]?.amount;
  const balance = getDenomUnitValue({ network: network || "celestia", amount });
  return {
    isLoading,
    error: error as Error,
    data: balance,
    refetch,
  };
};
