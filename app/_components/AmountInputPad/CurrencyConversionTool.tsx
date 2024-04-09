import type { Currency } from "../../types";
import cn from "classnames";
import { Icon } from "../Icon";
import * as S from "./amountInputPad.css";

export type CurrencyConversionToolProps = {
  value: number | string;
  currency?: Currency;
  onConvert: () => void;
};

export const CurrencyConversionTool = ({ value, currency, onConvert }: CurrencyConversionToolProps) => {
  return (
    <button className={cn(S.conversionTool)} onClick={onConvert}>
      <div>
        {value} {currency}
      </div>
      <Icon name="conversion" size={12} />
    </button>
  );
};
