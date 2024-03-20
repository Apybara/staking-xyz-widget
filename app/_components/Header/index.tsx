"use client";

import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/WidgetContext/hooks";

export const Header = () => {
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkDenom, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  return (
    <RootHeader
      currencyTabs={{
        activeCurrency: activeCurrency,
        activeNetworkDenom,
        onCurrencyChange: (cur) => onCurrencyRouterUpdate(cur),
      }}
      networkSelect={{
        activeNetwork,
        onNetworkChange: (net) => onNetworkRouterUpdate(net),
      }}
    />
  );
};
