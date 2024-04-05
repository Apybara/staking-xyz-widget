"use client";

import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/ShellContext/hooks";

export const Header = () => {
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkCurrency, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  return (
    <RootHeader
      currencyTabs={{
        activeCurrency: activeCurrency,
        activeNetworkCurrency,
        onCurrencyChange: (cur) => onCurrencyRouterUpdate(cur),
      }}
      networkSelect={{
        activeNetwork,
        onNetworkChange: (net) => onNetworkRouterUpdate(net),
      }}
    />
  );
};
