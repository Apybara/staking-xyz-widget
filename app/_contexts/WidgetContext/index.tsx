import type * as T from "./types";

import { createContext, useContext, useReducer } from "react";
import { useUnbondingDelegations } from "../../_services/unstake/hooks";
import { useWidgetRouterGate } from "./hooks";

const WidgetContext = createContext({} as T.WidgetContext);

export const useWidget = () => useContext(WidgetContext);

export const WidgetProvider = ({ children }: T.WidgetProviderProps) => {
  const [states, setStates] = useReducer<T.UseWidgetReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useWidgetRouterGate({ status: states.status, setStates });

  // Prefetch queries
  useUnbondingDelegations();

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
  status: "loading",
  setStates: () => {},
};
