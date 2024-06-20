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
import { getIsAleoNetwork } from "../../_services/aleo/utils";
import {
  useAleoWalletSupports,
  useAleoWalletStates,
  useAleoWalletHasStoredConnection,
} from "../../_services/aleo/hooks";

export const useWalletsSupport = ({ setStates }: { setStates: WalletStates["setStates"] }) => {
  const cosmosWalletsSupport = useCosmosWalletSupports();
  const aleoWalletsSupport = useAleoWalletSupports();

  useEffect(() => {
    setStates({ walletsSupport: { ...cosmosWalletsSupport, ...aleoWalletsSupport } });
  }, [
    cosmosWalletsSupport.keplr,
    cosmosWalletsSupport.keplrMobile,
    cosmosWalletsSupport.leap,
    cosmosWalletsSupport.leapMobile,
    cosmosWalletsSupport.okx,
    cosmosWalletsSupport.walletConnect,
    aleoWalletsSupport.leoWallet,
    aleoWalletsSupport.puzzle,
  ]);

  return null;
};

export const useActiveWalletStates = ({ setStates }: { setStates: WalletStates["setStates"] }) => {
  const { network } = useShell();

  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  const isAleoNetwork = network && getIsAleoNetwork(network);
  const aleoWalletStates = useAleoWalletStates();

  useEffect(() => {
    if (isCosmosNetwork) {
      setStates(cosmosWalletStates);
      return;
    }
    if (isAleoNetwork) {
      setStates(aleoWalletStates);
      return;
    }
  }, [
    isCosmosNetwork,
    cosmosWalletStates.activeWallet,
    cosmosWalletStates.connectionStatus,
    cosmosWalletStates.address,
    isAleoNetwork,
    aleoWalletStates.activeWallet,
    aleoWalletStates.connectionStatus,
    aleoWalletStates.address,
  ]);

  if (isCosmosNetwork) {
    return cosmosWalletStates;
  }
  if (isAleoNetwork) {
    return aleoWalletStates;
  }
};

export const useIsWalletConnectingEagerly = ({
  connectionStatus,
  activeWallet,
  setStates,
}: Pick<WalletStates, "connectionStatus" | "activeWallet" | "setStates">) => {
  const { network } = useShell();
  const { open } = useDialog("walletConnection");
  const [isConnectingEagerly, setIsConnectingEagerly] = useState<WalletStates["isEagerlyConnecting"]>(undefined);

  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const isCosmosWalletStored = useCosmosWalletHasStoredConnection();
  const isAleoNetwork = network && getIsAleoNetwork(network);
  const isAleoWalletStored = useAleoWalletHasStoredConnection();

  useEffect(() => {
    if (!open && connectionStatus === "connecting" && activeWallet && !isConnectingEagerly) {
      if (isCosmosNetwork && isCosmosWalletStored) {
        setIsConnectingEagerly(true);
      } else if (isAleoNetwork && isAleoWalletStored) {
        setIsConnectingEagerly(true);
      }
    } else {
      setIsConnectingEagerly(false);
    }
  }, [activeWallet, connectionStatus, open, isCosmosWalletStored, isCosmosNetwork, isAleoNetwork, isAleoWalletStored]);

  useEffect(() => {
    if (connectionStatus === "connected" && isConnectingEagerly) {
      setIsConnectingEagerly(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    setStates({ isEagerlyConnecting: isConnectingEagerly });
  }, [isConnectingEagerly]);
};
