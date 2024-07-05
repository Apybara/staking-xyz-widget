import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { Skeleton } from "../Skeleton";
import { MaxButton } from "./MaxButton";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";
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
}: RootAmountInputPadProps) => {
  const { network } = useShell();
  const searchParams = useSearchParams();

  const validator = searchParams.get("validator");
  const isAleoNetwork = network && getIsAleoNetwork(network);

  // dummy
  const isValidatorValid = !!validator;

  const validatorDetails = {
    name: "Finoa Consensus Services",
    address: "aleo1pfka50hst70ckhlg3jz5x3nycwzt890v30q9d9vp8p74amds75rsfdwglj",
  };

  const isValidatorBoxActive = isValidatorValid && type === "stake";

  return (
    <div className={cn(className, S.amountInputPad({ hasErrorMessage: !!error, hasValidator: isValidatorBoxActive }))}>
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
      {!!error && <span className={S.errorMessage}>{error}</span>}
      {isValidatorBoxActive && <InputPadValidator {...validatorDetails} />}
    </div>
  );
};
