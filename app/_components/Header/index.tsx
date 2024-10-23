"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { useShell } from "@/app/_contexts/ShellContext";
import { getLinkWithSearchParams } from "../../_utils/routes";

export const Header = () => {
  const { network, stakingType } = useShell();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkCurrency, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  const isAleoLiquidUnstakePage = network === "aleo" && pathname === "/unstake" && stakingType === "liquid";
  const homeLink = getLinkWithSearchParams(
    {
      network: searchParams.get("network") || undefined,
      currency: searchParams.get("currency") || undefined,
      userId: searchParams.get("userId") || undefined,
    },
    "",
  );

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
      homeLink={homeLink}
    />
  );
};
