import type * as T from "./types";

import { createContext, useContext, useReducer } from "react";
import { useActivity, useLastOffsetActivity } from "../../_services/stakingOperator/hooks";
import { useInitLogRocket } from "../../_services/logRocket/hooks";

import { useWidgetRouterGate } from "./hooks";

const WidgetContext = createContext({} as T.WidgetContext);

export const useWidget = () => useContext(WidgetContext);

export const WidgetProvider = ({ children }: T.WidgetProviderProps) => {
  const [states, setStates] = useReducer<T.UseWidgetReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  useInitLogRocket();
  useWidgetRouterGate({ status: states.status, setStates });

  // Prefetch queries
  const activity = useActivity(null);
  useLastOffsetActivity({
    limit: activity?.params.limit,
    filterKey: activity?.params.filterKey,
    lastOffset: activity?.query?.lastOffset || 0,
  });

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
