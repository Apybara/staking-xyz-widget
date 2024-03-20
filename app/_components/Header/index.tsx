"use client";

import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/WidgetContext/hooks";

export const Header = () => {
  const { activeNetwork, onChange: onNetworkChange } = useNetworkChange();
  const { activeCurrency, activeNetworkDenom, onChange: onCurrencyChange } = useCurrencyChange();

  return (
    <RootHeader
      currencyTabs={{
        activeCurrency: activeCurrency,
        activeNetworkDenom,
        onCurrencyChange: (cur) => onCurrencyChange(cur),
      }}
      networkSelect={{
        activeNetwork,
        onNetworkChange: (net) => onNetworkChange(net),
      }}
    />
  );
};
