import type { Dispatch, Reducer, ReactNode } from "react";
import type { WalletType, WalletConnectionStatus } from "../../types";

export type WalletContext = WalletStates & {};

export type WalletStates = {
  walletsSupport: Record<WalletType, boolean | null>;
  activeWallet: WalletType | null;
  address: string | null;
  connectionStatus: WalletConnectionStatus;
  isEagerlyConnecting?: boolean;
  keplrSuggestConnectError?: boolean;
  setStates: Dispatch<Partial<WalletStates>>;
};

export type WalletProviderProps = {
  children: ReactNode;
};

export type UseWalletReducer = Reducer<WalletStates, Partial<WalletStates>>;
