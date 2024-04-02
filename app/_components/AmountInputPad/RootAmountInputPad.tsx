import type { ReactNode } from "react";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { MaxButton } from "./MaxButton";
import * as S from "./amountInputPad.css";

export type RootAmountInputPadProps = {
  availableValue?: string;
  availabilityElement?: ReactNode;
  inputField: InputFieldProps;
  currencyConversionTool: CurrencyConversionToolProps;
  onClickMax: () => void;
};

export const RootAmountInputPad = ({
  availableValue,
  availabilityElement,
  inputField,
  currencyConversionTool,
  onClickMax,
}: RootAmountInputPadProps) => {
  return (
    <div className={cn(S.amountInputPad)}>
      {availabilityElement && (
        <div className={cn(S.topBar)}>
          {availabilityElement}
          {availableValue && <MaxButton onClick={onClickMax} />}
        </div>
      )}
      <div className={cn(S.mainControlBox)}>
        <InputField {...inputField} />
        <CurrencyConversionTool {...currencyConversionTool} />
      </div>
    </div>
  );
};
