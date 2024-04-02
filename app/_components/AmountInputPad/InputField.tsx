import type { InputHTMLAttributes } from "react";
import type { Currency } from "../../types";
import { forwardRef } from "react";
import cn from "classnames";
import { currencyMap } from "../../consts";
import * as S from "./amountInputPad.css";

export type InputFieldProps = HTMLInputFieldProps & {
  currency: Currency;
};

export const InputField = ({ currency, ...props }: InputFieldProps) => {
  const isFiatCurrency = currency === "USD" || currency === "EUR";

  return (
    <div className={S.inputField}>
      {isFiatCurrency && <span>{currencyMap[currency]}</span>}
      <HTMLInputField {...props} />
    </div>
  );
};

const HTMLInputField = forwardRef<HTMLInputElement, HTMLInputFieldProps>(({ className, style, ...props }, ref) => {
  return (
    <input
      ref={ref}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0"
      minLength={1}
      maxLength={79}
      spellCheck={false}
      className={cn(S.htmlInputField, className)}
      style={{ marginInlineEnd: props.value === "" || props.value === "0" ? -12 : 0 }}
      {...props}
    />
  );
});

type HTMLInputFieldProps = InputHTMLAttributes<HTMLInputElement>;
