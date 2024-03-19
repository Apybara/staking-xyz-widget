"use client";

import { RootHeader } from "./RootHeader";
import { useCurrencyChange } from "../CurrencyTabs/hooks";

export const Header = () => {
  const { activeCurrency, onChange } = useCurrencyChange();

  return (
    <RootHeader
      currencyTabs={{
        activeOption: activeCurrency,
        onCurrencyChange: (cur) => onChange(cur),
      }}
    />
  );
};
