import type * as T from "./types";

import { createContext, useContext, useReducer } from "react";
import { useActiveCurrency, useActiveNetwork } from "./hooks";

const WidgetContext = createContext({} as T.WidgetContext);

export const useWidget = () => useContext(WidgetContext);

export const WidgetProvider = ({ children }: T.WidgetProviderProps) => {
  const [states, setStates] = useReducer<T.UseWidgetReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useActiveCurrency({ setStates });
  useActiveNetwork({ setStates });

  return (
    <WidgetContext.Provider
      value={{
        ...states,
        setStates,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

const initialStates: T.WidgetContext = {
  network: null,
  currency: null,
  setStates: () => {},
};
