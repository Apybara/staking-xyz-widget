import type * as T from "./types";

import { createContext, useContext, useEffect, useReducer } from "react";
import { useWalletsSupport, useActiveWalletStates, useIsWalletConnectingEagerly } from "./hooks";

const WalletContext = createContext({} as T.WalletContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: T.WalletProviderProps) => {
  const [states, setStates] = useReducer<T.UseWalletReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useWalletsSupport({ setStates });
  useActiveWalletStates({ connectedAddress: states.connectedAddress, setStates });
  useIsWalletConnectingEagerly(states);

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
  connectedAddress: [],
  setStates: () => {},
};
