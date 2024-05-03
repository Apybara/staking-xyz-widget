import type * as T from "./types";

import { createContext, useContext, useReducer, useEffect } from "react";
import { usePostHogEvent } from "../../_services/postHog/hooks";
import { useWalletsSupport, useActiveWalletStates, useIsWalletConnectingEagerly } from "./hooks";

const WalletContext = createContext({} as T.WalletContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: T.WalletProviderProps) => {
  const [states, setStates] = useReducer<T.UseWalletReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useWalletsSupport({ setStates });
  useActiveWalletStates({ setStates });
  useIsWalletConnectingEagerly(states);

  // Failed connection event is tracked in WalletConnectionDialog
  const captureWalletConnectSuccess = usePostHogEvent("wallet_connect_succeeded");
  useEffect(() => {
    if (states.connectionStatus === "connected" && states.activeWallet && states.address) {
      captureWalletConnectSuccess({ wallet: states.activeWallet, address: states.address });
    }
  }, [states.activeWallet, states.connectionStatus, states.address]);

  return (
    <WalletContext.Provider
      value={{
        ...states,
        setStates,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const initialStates: T.WalletContext = {
  walletsSupport: {
    keplr: null,
    keplrMobile: null,
    leap: null,
    leapMobile: null,
    okx: null,
    walletConnect: null,
  },
  activeWallet: null,
  address: null,
  connectionStatus: "disconnected",
  isEagerlyConnecting: false,
  setStates: () => { },
};
