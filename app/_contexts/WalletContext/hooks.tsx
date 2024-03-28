import type { WalletStates } from "./types";
import { useEffect } from "react";
import { useWidget } from "../WidgetContext";
import { getIsCosmosNetwork } from "../../_services/cosmos/utils";
import { useCosmosWalletStates, useCosmosWalletSupports } from "../../_services/cosmos/hooks";

export const useWalletsSupport = ({ setStates }: { setStates: WalletStates["setStates"] }) => {
  const { network } = useWidget();
  const cosmosWalletsSupport = useCosmosWalletSupports(network || "celestia");

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
  const { network } = useWidget();
  const isCosmosNetwork = network && getIsCosmosNetwork(network);
  const cosmosWalletStates = useCosmosWalletStates({ network: isCosmosNetwork ? network : undefined });

  useEffect(() => {
    if (isCosmosNetwork) {
      setStates({ ...cosmosWalletStates });
      return;
    }
  }, [
    isCosmosNetwork,
    cosmosWalletStates.activeWallet,
    cosmosWalletStates.connectionStatus,
    cosmosWalletStates.address,
  ]);
};
