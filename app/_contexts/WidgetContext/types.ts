import type { Dispatch, Reducer, ReactNode } from "react";
import type { Currency, CoinPrice, Network } from "../../types";

export type WidgetContext = WidgetStates & {};

export type WidgetStates = {
  network: Network | null;
  currency: Currency | null;
  coinPrice: CoinPrice | null;
  isOnMobileDevice?: boolean;
  setStates: Dispatch<Partial<WidgetStates>>;
};

export type WidgetProviderProps = {
  initialCoinPrice?: CoinPrice;
  isOnMobileDevice?: boolean;
  children: ReactNode;
};

export type UseWidgetReducer = Reducer<WidgetStates, Partial<WidgetStates>>;
