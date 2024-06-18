import type { AleoWalletType, AleoNetwork } from "../../types";
import { useWallet as useLeoWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useIsLeoWalletInstalled, useLeoWalletStates, useLeoWalletConnector } from "./leoWallet/hooks";
import { getMicroCreditsToCredits } from "./utils";

export const useAleoWalletSupports = () => {
  const isLeoWalletInstalled = useIsLeoWalletInstalled();

  return {
    leoWallet: isLeoWalletInstalled,
  } as Record<AleoWalletType, boolean>;
};

export const useAleoWalletConnectors = ({ network = "aleo" }: { network?: AleoNetwork }) => {
  const leoWalletConnector = useLeoWalletConnector();

  return {
    leoWallet: leoWalletConnector,
  };
};

export const useAleoWalletDisconnectors = () => {
  const { disconnect } = useLeoWallet();

  return {
    leoWallet: disconnect,
  };
};

export const useAleoWalletStates = () => {
  const leoWalletStates = useLeoWalletStates();

  return leoWalletStates;
};

export const useAleoWalletBalance = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: AleoNetwork | null;
  activeWallet: AleoWalletType | null;
}) => {
  const leoWalletBalance = useAleoBalanceFromStakingOperator({ address, network });

  if (!activeWallet) return null;
  if (activeWallet === "leoWallet") return leoWalletBalance;
  return null;
};

const useAleoBalanceFromStakingOperator = ({
  address,
  network,
  refetchInterval = 15000,
}: {
  address: string | null;
  network: AleoNetwork | null;
  refetchInterval?: number;
}) => {
  const balanceFromStakingOperator = undefined;

  if (!address || !balanceFromStakingOperator) return null;
  return {
    isLoading: false,
    error: null,
    data: getMicroCreditsToCredits(balanceFromStakingOperator).toString(),
  };
};
