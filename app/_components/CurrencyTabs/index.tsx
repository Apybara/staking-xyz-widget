import cn from "classnames";
import * as S from "./currencyTabs.css";

export type CurrencyTabsProps = {
  activeOption: CurrencyOption;
  onCurrencyChange: (currency: CurrencyOption) => void;
};

export const CurrencyTabs = ({ activeOption, onCurrencyChange }: CurrencyTabsProps) => {
  return (
    <ul className={cn(S.tabs)}>
      <li>
        <button
          className={cn(S.tabButton({ state: activeOption === "EUR" ? "highlighted" : "default" }))}
          onClick={() => onCurrencyChange("EUR")}
        >
          {CurrencyMap.EUR}
        </button>
      </li>
      <li>
        <button
          className={cn(S.tabButton({ state: activeOption === "USD" ? "highlighted" : "default" }))}
          onClick={() => onCurrencyChange("USD")}
        >
          {CurrencyMap.USD}
        </button>
      </li>
      <li>
        <button
          className={cn(S.tabButton({ state: activeOption === "TIA" ? "highlighted" : "default" }))}
          onClick={() => onCurrencyChange("TIA")}
        >
          {CurrencyMap.TIA}
        </button>
      </li>
    </ul>
  );
};

export type CurrencyOption = "USD" | "EUR" | "TIA";

const CurrencyMap = {
  USD: "$",
  EUR: "€",
  TIA: "TIA",
};
