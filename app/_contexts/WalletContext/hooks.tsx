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

export const useActiveWalletStates = ({
  connectedAddress,
  setStates,
}: {
  connectedAddress: WalletStates["connectedAddress"];
  setStates: WalletStates["setStates"];
}) => {
  const { network } = useShell();
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  useEffect(() => {
    if (isCosmosNetwork) {
      setStates({
        ...cosmosWalletStates,
        connectedAddress: cosmosWalletStates.address
          ? [...connectedAddress, cosmosWalletStates.address]
          : connectedAddress,
      });
      return;
    }
  }, [
    isCosmosNetwork,
    cosmosWalletStates.activeWallet,
    cosmosWalletStates.connectionStatus,
    cosmosWalletStates.address,
  ]);
};

export const useIsWalletConnectingEagerly = ({
  connectionStatus,
  activeWallet,
  setStates,
}: Pick<WalletStates, "connectionStatus" | "activeWallet" | "setStates">) => {
  const { open } = useDialog("walletConnection");
  const isCosmosWalletStored = useCosmosWalletHasStoredConnection();
  const [isConnectingEagerly, setIsConnectingEagerly] = useState(false);

  useEffect(() => {
    if (isCosmosWalletStored && !open && connectionStatus === "connecting" && activeWallet && !isConnectingEagerly) {
      setIsConnectingEagerly(true);
    }
  }, [activeWallet, connectionStatus, open, isCosmosWalletStored]);

  useEffect(() => {
    if (connectionStatus === "connected" && isConnectingEagerly) {
      setIsConnectingEagerly(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    setStates({ isEagerlyConnecting: isConnectingEagerly });
  }, [isConnectingEagerly]);
};
