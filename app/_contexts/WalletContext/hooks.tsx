import type { WalletStates } from "./types";
import { useEffect, useState } from "react";
import { useShell } from "../ShellContext";
import { useDialog } from "../../_contexts/UIContext";
import { getIsCosmosNetwork } from "../../_services/cosmos/utils";
import {
  useCosmosWalletStates,
  useCosmosWalletSupports,
  useCosmosWalletHasStoredConnection,
} from "../../_services/cosmos/hooks";

export const useWalletsSupport = ({ setStates }: { setStates: WalletStates["setStates"] }) => {
  const cosmosWalletsSupport = useCosmosWalletSupports();

  useEffect(() => {
    setStates({ walletsSupport: { ...cosmosWalletsSupport } });
  }, [
    cosmosWalletsSupport.keplr,
    cosmosWalletsSupport.keplrMobile,
    cosmosWalletsSupport.leap,
    cosmosWalletsSupport.leapMobile,
    cosmosWalletsSupport.okx,
    cosmosWalletsSupport.walletConnect,
  ]);

  return null;
};

export const useActiveWalletStates = ({ setStates }: { setStates: WalletStates["setStates"] }) => {
  const { network } = useShell();
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  useEffect(() => {
    if (isCosmosNetwork) {
      setStates(cosmosWalletStates);
      return;
    }
  }, [
    isCosmosNetwork,
    cosmosWalletStates.activeWallet,
    cosmosWalletStates.connectionStatus,
    cosmosWalletStates.address,
  ]);

  if (isCosmosNetwork) {
    return cosmosWalletStates;
  }
};

export const useIsWalletConnectingEagerly = ({
  connectionStatus,
  activeWallet,
  setStates,
}: Pick<WalletStates, "connectionStatus" | "activeWallet" | "setStates">) => {
  const { network } = useShell();
  const { open } = useDialog("walletConnection");
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const isCosmosWalletStored = useCosmosWalletHasStoredConnection();
  const [isConnectingEagerly, setIsConnectingEagerly] = useState<WalletStates["isEagerlyConnecting"]>(undefined);

  useEffect(() => {
    if (!open && connectionStatus === "connecting" && activeWallet && !isConnectingEagerly) {
      if (isCosmosNetwork && isCosmosWalletStored) {
        setIsConnectingEagerly(true);
      }
    } else {
      setIsConnectingEagerly(false);
    }
  }, [activeWallet, connectionStatus, open, isCosmosWalletStored, isCosmosNetwork]);

  useEffect(() => {
    if (connectionStatus === "connected" && isConnectingEagerly) {
      setIsConnectingEagerly(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    setStates({ isEagerlyConnecting: isConnectingEagerly });
  }, [isConnectingEagerly]);
};
