import type { ReactNode } from "react";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { Skeleton } from "../Skeleton";
import { MaxButton } from "./MaxButton";
import { InputPadValidator } from "./InputPadValidator";

import * as S from "./amountInputPad.css";

export type RootAmountInputPadProps = {
  type: "stake" | "unstake";
  className?: string;
  availableValue?: string;
  availabilityElement?: ReactNode;
  isAvailableValueLoading?: boolean;
  inputField: InputFieldProps;
  currencyConversionTool: CurrencyConversionToolProps;
  onClickMax: () => void;
  maxTooltip?: ReactNode;
  isMaxDisabled?: boolean;
  error?: string;
  hideCurrencyConversion?: boolean;
  validatorInfo?: {
    isLoading: boolean;
    name: string;
    logo: string;
    address: string;
  };
};

export const RootAmountInputPad = ({
  type,
  className,
  availableValue,
  availabilityElement,
  isAvailableValueLoading,
  inputField,
  currencyConversionTool,
  onClickMax,
  maxTooltip,
  isMaxDisabled,
  error,
  hideCurrencyConversion = false,
  validatorInfo,
}: RootAmountInputPadProps) => {
  return (
    <div className={cn(className, S.amountInputPad({ hasErrorMessage: !!error, hasValidator: !!validatorInfo }))}>
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
            <MaxButton onClick={onClickMax} tooltip={maxTooltip} disabled={isMaxDisabled} />
          )}
        </div>
      )}
      <div className={cn(S.mainControlBox)}>
        <InputField {...inputField} />
        {!hideCurrencyConversion && <CurrencyConversionTool {...currencyConversionTool} />}
      </div>
      {!!error && <span className={S.errorMessage}>{error}</span>}
      {!!validatorInfo && (
        <InputPadValidator
          isLoading={validatorInfo.isLoading}
          name={validatorInfo?.name}
          logo={validatorInfo?.logo}
          address={validatorInfo?.address}
        />
      )}
    </div>
  );
};
