import type { Dispatch, Reducer, ReactNode } from "react";
import type { CurrencyOption } from "../../_components/CurrencyTabs";

export type WidgetContext = WidgetStates & {};

export type WidgetStates = {
  currency: CurrencyOption | null;
  setStates: Dispatch<Partial<WidgetStates>>;
};

export type WidgetProviderProps = {
  children: ReactNode;
};

export type UseWidgetReducer = Reducer<WidgetStates, Partial<WidgetStates>>;
