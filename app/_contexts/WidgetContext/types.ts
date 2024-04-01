import type { Dispatch, Reducer, ReactNode } from "react";

export type WidgetContext = WidgetStates & {};

export type WidgetStates = {
  status: "loading" | "loaded";
  setStates: Dispatch<Partial<WidgetStates>>;
};

export type WidgetProviderProps = {
  children: ReactNode;
};

export type UseWidgetReducer = Reducer<WidgetStates, Partial<WidgetStates>>;
