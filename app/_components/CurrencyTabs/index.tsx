import type { Currency, NetworkDenom } from "../../types";
import cn from "classnames";
import * as Select from "../Select";
import { currencyMap } from "../../consts";
import * as S from "./currencyTabs.css";

export type CurrencyTabsProps = {
  activeCurrency: Currency;
  activeNetworkDenom: NetworkDenom | null;
  onCurrencyChange: (currency: Currency) => void;
};

export const CurrencyTabs = ({ activeCurrency, activeNetworkDenom, onCurrencyChange }: CurrencyTabsProps) => {
  return (
    <>
      <ul className={cn(S.tabs)}>
        <li>
          <button
            className={cn(S.tabButton({ state: activeCurrency === "EUR" ? "highlighted" : "default" }))}
            onClick={() => onCurrencyChange("EUR")}
          >
            {currencyMap.EUR}
          </button>
        </li>
        <li>
          <button
            className={cn(S.tabButton({ state: activeCurrency === "USD" ? "highlighted" : "default" }))}
            onClick={() => onCurrencyChange("USD")}
          >
            {currencyMap.USD}
          </button>
        </li>
        {activeNetworkDenom && (
          <li>
            <button
              className={cn(S.tabButton({ state: activeCurrency === activeNetworkDenom ? "highlighted" : "default" }))}
              onClick={() => onCurrencyChange(activeNetworkDenom)}
            >
              {activeNetworkDenom}
            </button>
          </li>
        )}
      </ul>
      <div className={cn(S.selectTabs)}>
        <CurrencySelect
          activeCurrency={activeCurrency}
          activeNetworkDenom={activeNetworkDenom}
          onCurrencyChange={onCurrencyChange}
        />
      </div>
    </>
  );
};

const CurrencySelect = ({ activeCurrency, activeNetworkDenom, onCurrencyChange }: CurrencyTabsProps) => {
  return (
    <Select.Main
      defaultValue={activeCurrency}
      onValueChange={(value) => onCurrencyChange(value as Currency)}
      triggerContent={<Select.TriggerSet label="Currency" className={cn(S.selectTrigger)} />}
      items={
        <>
          <Select.Item className={cn(S.selectOptionText)} value="USD">
            <Select.ItemText>{currencyMap.USD}</Select.ItemText>
          </Select.Item>
          <Select.Item className={cn(S.selectOptionText)} value="EUR">
            <Select.ItemText>{currencyMap.EUR}</Select.ItemText>
          </Select.Item>
          {activeNetworkDenom && (
            <Select.Item className={cn(S.selectOptionText)} value={activeNetworkDenom}>
              <Select.ItemText>{activeNetworkDenom}</Select.ItemText>
            </Select.Item>
          )}
        </>
      }
    />
  );
};
