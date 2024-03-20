import type { Dispatch, Reducer, ReactNode } from "react";
import type { Currency, Network } from "../../types";

export type WidgetContext = WidgetStates & {};

export type WidgetStates = {
  network: Network | null;
  currency: Currency | null;
  setStates: Dispatch<Partial<WidgetStates>>;
};

export type WidgetProviderProps = {
  children: ReactNode;
};

export type UseWidgetReducer = Reducer<WidgetStates, Partial<WidgetStates>>;
