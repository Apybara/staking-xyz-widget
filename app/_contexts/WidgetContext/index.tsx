import type * as T from "./types";

import { createContext, useContext, useEffect, useReducer } from "react";
import useLocalStorage from "use-local-storage";
import { useActivity, useLastOffsetActivity } from "../../_services/stakingOperator/hooks";
import { useInitLogRocket } from "../../_services/logRocket/hooks";
import type { PendingTransaction } from "@/app/types";

import { useWidgetRouterGate } from "./hooks";

const WidgetContext = createContext({} as T.WidgetContext);

export const useWidget = () => useContext(WidgetContext);

export const WidgetProvider = ({ children }: T.WidgetProviderProps) => {
  const [states, setStates] = useReducer<T.UseWidgetReducer>((prev, next) => ({ ...prev, ...next }), initialStates);
  const [pendingTransactions, setPendingTransactions] = useLocalStorage<Array<PendingTransaction>>(
    "pendingTransactions",
    [],
  );

  useInitLogRocket();
  useWidgetRouterGate({ status: states.status, setStates });

  // Prefetch queries
  const activity = useActivity(null);
  const { data: activityData } =
    useLastOffsetActivity({
      limit: activity?.params.limit,
      filterKey: activity?.params.filterKey,
      lastOffset: activity?.query?.lastOffset || 0,
    }) || {};

  const allActivityData = activityData?.entries;

  // Use activity data to update pending transaction status, especially when page is refreshed

  // useEffect(() => {
  //   const updatedTransactions = pendingTransactions?.map((transaction) => {
  //     const isBroadcasted = allActivityData?.some(({ txId }) => txId === transaction.txId);

  //     return isBroadcasted ? ({ ...transaction, status: "success" } as PendingTransaction) : transaction;
  //   });

  //   setPendingTransactions(updatedTransactions);
  // }, [allActivityData]);

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
