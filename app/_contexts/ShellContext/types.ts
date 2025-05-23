import type { Dispatch, Reducer, ReactNode } from "react";
import type { Currency, CoinPrice, Network, StakingType } from "../../types";

export type ShellContext = ShellStates & {};

export type ShellStates = {
  stakingType: StakingType | null;
  network: Network | null;
  currency: Currency | null;
  coinPrice: CoinPrice | null;
  validator?: string | null;
  isOnMobileDevice?: boolean;
  isScrollActive?: boolean;
  setStates: Dispatch<Partial<ShellStates>>;
};

export type ShellProviderProps = {
  initialCoinPrice?: CoinPrice;
  isOnMobileDevice?: boolean;
  children: ReactNode;
};

export type UseShellReducer = Reducer<ShellStates, Partial<ShellStates>>;
