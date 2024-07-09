import type * as T from "./types";

import { createContext, useContext, useReducer } from "react";
import { useActiveCurrency, useActiveNetwork, useActiveStakingType, useActiveValidator } from "./hooks";

const ShellContext = createContext({} as T.ShellContext);

export const useShell = () => useContext(ShellContext);

export const ShellProvider = ({ initialCoinPrice, isOnMobileDevice, children }: T.ShellProviderProps) => {
  const [states, setStates] = useReducer<T.UseShellReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useActiveCurrency({ setStates });
  useActiveNetwork({ setStates });
  useActiveStakingType({ setStates });
  useActiveValidator({ setStates });

  return (
    <ShellContext.Provider
      value={{
        ...states,
        coinPrice: initialCoinPrice || states.coinPrice,
        isOnMobileDevice,
        setStates,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
};

const initialStates: T.ShellContext = {
  stakingType: null,
  network: null,
  currency: null,
  coinPrice: null,
  validator: null,
  isOnMobileDevice: undefined,
  isScrollActive: false,
  setStates: () => {},
};
