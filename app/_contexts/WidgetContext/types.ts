import type { Dispatch, Reducer, ReactNode } from "react";
import type { Currency, CoinPrice, Network } from "../../types";

export type WidgetContext = WidgetStates & {};

export type WidgetStates = {
  network: Network | null;
  currency: Currency | null;
  coinPrice: CoinPrice | null;
  setStates: Dispatch<Partial<WidgetStates>>;
};

export type WidgetProviderProps = {
  initialCoinPrice?: CoinPrice;
  children: ReactNode;
};

export type UseWidgetReducer = Reducer<WidgetStates, Partial<WidgetStates>>;
