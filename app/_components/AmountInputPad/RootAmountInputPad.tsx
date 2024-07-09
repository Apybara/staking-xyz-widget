import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { type InputFieldProps, InputField } from "./InputField";
import { type CurrencyConversionToolProps, CurrencyConversionTool } from "./CurrencyConversionTool";
import cn from "classnames";
import { Skeleton } from "../Skeleton";
import { MaxButton } from "./MaxButton";
import { useStaking } from "@/app/_contexts/StakingContext";
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
  const { network, validator } = useShell();
  const { isLoadingValidatorDetails, validatorDetails, isInvalidValidator } = useStaking();

  const isAleoNetwork = network && getIsAleoNetwork(network);
  const isValidatorBoxActive = !!validator && type === "stake" && !isInvalidValidator;

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
      {isValidatorBoxActive && (
        <InputPadValidator
          isLoading={isLoadingValidatorDetails}
          name={validatorDetails?.name}
          logo={validatorDetails?.logo}
          address={validatorDetails?.validatorAddress}
        />
      )}
    </div>
  );
};
