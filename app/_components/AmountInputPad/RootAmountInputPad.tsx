import type { ReactNode } from "react";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { Skeleton } from "../Skeleton";
import { MaxButton } from "./MaxButton";
import * as S from "./amountInputPad.css";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";

export type RootAmountInputPadProps = {
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
};

export const RootAmountInputPad = ({
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
}: RootAmountInputPadProps) => {
  const { network, stakingType } = useShell();
  const isAleoNetwork = network && getIsAleoNetwork(network);

  return (
    <div className={cn(className, S.amountInputPad)}>
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
        {!isAleoNetwork && <CurrencyConversionTool {...currencyConversionTool} />}
      </div>
      {!!stakingType && !!error && <span className={S.errorMessage}>{error}</span>}
    </div>
  );
};
