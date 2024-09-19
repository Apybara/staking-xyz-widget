"use client";

import { usePathname } from "next/navigation";
import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/ShellContext/hooks";

export const Header = () => {
  const pathname = usePathname();
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkCurrency, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  const isUnstakePage = pathname === "/unstake";

  return (
    <RootHeader
      showCurrencyTool={!isUnstakePage}
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
