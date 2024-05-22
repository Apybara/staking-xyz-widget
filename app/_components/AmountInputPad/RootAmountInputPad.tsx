import type { ReactNode } from "react";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { Skeleton } from "../Skeleton";
import { MaxButton } from "./MaxButton";
import * as S from "./amountInputPad.css";

export type RootAmountInputPadProps = {
  availableValue?: string;
  availabilityElement?: ReactNode;
  isAvailableValueLoading?: boolean;
  inputField: InputFieldProps;
  currencyConversionTool: CurrencyConversionToolProps;
  onClickMax: () => void;
  maxTooltip?: ReactNode;
};

export const RootAmountInputPad = ({
  availableValue,
  availabilityElement,
  isAvailableValueLoading,
  inputField,
  currencyConversionTool,
  onClickMax,
  maxTooltip,
}: RootAmountInputPadProps) => {
  return (
    <div className={cn(S.amountInputPad)}>
      {isAvailableValueLoading && (
        <div className={cn(S.topBar)}>
          <Skeleton height={24} width={100} />
          <Skeleton height={24} width={50} />
        </div>
      )}
      {availabilityElement && !isAvailableValueLoading && (
        <div className={cn(S.topBar)}>
          {availabilityElement}
          {availableValue && availableValue !== "" && availableValue !== "0" && (
            <MaxButton onClick={onClickMax} tooltip={maxTooltip} />
          )}
        </div>
      )}
      <div className={cn(S.mainControlBox)}>
        <InputField {...inputField} />
        <CurrencyConversionTool {...currencyConversionTool} />
      </div>
    </div>
  );
};
