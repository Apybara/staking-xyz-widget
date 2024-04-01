import type { Dispatch, Reducer, ReactNode } from "react";
import type { Currency, CoinPrice, Network } from "../../types";

export type ShellContext = ShellStates & {};

export type ShellStates = {
  network: Network | null;
  currency: Currency | null;
  coinPrice: CoinPrice | null;
  isOnMobileDevice?: boolean;
  setStates: Dispatch<Partial<ShellStates>>;
};

export type ShellProviderProps = {
  initialCoinPrice?: CoinPrice;
  isOnMobileDevice?: boolean;
  children: ReactNode;
};

export type UseShellReducer = Reducer<ShellStates, Partial<ShellStates>>;
