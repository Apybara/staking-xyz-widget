"use client";

import { RootHeader } from "./RootHeader";
import { useNetworkChange, useCurrencyChange } from "../../_contexts/ShellContext/hooks";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";

export const Header = () => {
  const { network } = useShell();
  const { activeNetwork, onUpdateRouter: onNetworkRouterUpdate } = useNetworkChange();
  const { activeCurrency, activeNetworkCurrency, onUpdateRouter: onCurrencyRouterUpdate } = useCurrencyChange();

  const isAleoNetwork = network && getIsAleoNetwork(network);

  return (
    <RootHeader
      showCurrencyTool={!isAleoNetwork}
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
