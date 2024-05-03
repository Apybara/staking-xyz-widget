import type { InputHTMLAttributes } from "react";
import type { Currency } from "../../types";
import { forwardRef, useRef } from "react";
import cn from "classnames";
import { fiatCurrencyMap } from "../../consts";
import * as S from "./amountInputPad.css";

export type InputFieldProps = HTMLInputFieldProps & {
  currency: Currency;
};

export const InputField = ({ currency, value, ...props }: InputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isFiatCurrency = currency === "USD" || currency === "EUR";

  return (
    <div className={S.inputField} onClick={() => inputRef.current?.focus()}>
      {isFiatCurrency && <span>{fiatCurrencyMap[currency]}</span>}

      <div className={S.htmlInputFieldContainer}>
        <div className={S.htmlInputFieldWidth}>
          {/* Mirrors the input's value, hence the container's dynamic width */}
          {value || 0}
        </div>

        <HTMLInputField ref={inputRef} value={value} {...props} />
      </div>
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
      {...props}
    />
  );
});

export const getStringHasNumbersOnly = (val: string) => {
  if (val === "") return true;

  const regex = /^\d+\.?\d*$/;
  return regex.test(val);
};

type HTMLInputFieldProps = InputHTMLAttributes<HTMLInputElement>;
