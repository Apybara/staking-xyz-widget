"use client";

import { usePathname } from "next/navigation";
import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { useShell } from "@/app/_contexts/ShellContext";

export const Header = () => {
  const { network, stakingType } = useShell();
  const pathname = usePathname();
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkCurrency, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  const isAleoLiquidUnstakePage = network === "aleo" && pathname === "/unstake" && stakingType === "liquid";

  return (
    <RootHeader
      showCurrencyTool={!isAleoLiquidUnstakePage}
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
