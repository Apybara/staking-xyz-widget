import type { Currency, NetworkCurrency } from "../../types";
import cn from "classnames";
import * as Select from "../Select";
import { fiatCurrencyMap } from "../../consts";
import * as S from "./currencyTabs.css";

export type CurrencyTabsProps = {
  activeCurrency: Currency;
  activeNetworkCurrency: NetworkCurrency | null;
  onCurrencyChange: (currency: Currency) => void;
};

export const CurrencyTabs = ({ activeCurrency, activeNetworkCurrency, onCurrencyChange }: CurrencyTabsProps) => {
  return (
    <>
      <ul className={cn(S.tabs)}>
        <li>
          <button
            className={cn(S.tabButton({ state: activeCurrency === "EUR" ? "highlighted" : "default" }))}
            onClick={() => onCurrencyChange("EUR")}
          >
            {fiatCurrencyMap.EUR}
          </button>
        </li>
        <li>
          <button
            className={cn(S.tabButton({ state: activeCurrency === "USD" ? "highlighted" : "default" }))}
            onClick={() => onCurrencyChange("USD")}
          >
            {fiatCurrencyMap.USD}
          </button>
        </li>
        {activeNetworkCurrency && (
          <li>
            <button
              className={cn(
                S.tabButton({ state: activeCurrency === activeNetworkCurrency ? "highlighted" : "default" }),
              )}
              onClick={() => onCurrencyChange(activeNetworkCurrency)}
            >
              {activeNetworkCurrency}
            </button>
          </li>
        )}
      </ul>
      <div className={cn(S.selectTabs)}>
        <CurrencySelect
          activeCurrency={activeCurrency}
          activeNetworkCurrency={activeNetworkCurrency}
          onCurrencyChange={onCurrencyChange}
        />
      </div>
    </>
  );
};

const CurrencySelect = ({ activeCurrency, activeNetworkCurrency, onCurrencyChange }: CurrencyTabsProps) => {
  return (
    <Select.Main
      value={activeCurrency}
      defaultValue={activeCurrency}
      onValueChange={(value) => onCurrencyChange(value as Currency)}
      triggerContent={<Select.TriggerSet label="Currency" className={cn(S.selectTrigger)} />}
      items={
        <>
          <Select.Item className={cn(S.selectOptionText)} value="USD">
            <Select.ItemText>{fiatCurrencyMap.USD}</Select.ItemText>
          </Select.Item>
          <Select.Item className={cn(S.selectOptionText)} value="EUR">
            <Select.ItemText>{fiatCurrencyMap.EUR}</Select.ItemText>
          </Select.Item>
          {activeNetworkCurrency && (
            <Select.Item className={cn(S.selectOptionText)} value={activeNetworkCurrency}>
              <Select.ItemText>{activeNetworkCurrency}</Select.ItemText>
            </Select.Item>
          )}
        </>
      }
    />
  );
};
