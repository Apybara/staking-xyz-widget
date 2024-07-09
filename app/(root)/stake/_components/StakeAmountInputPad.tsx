"use client";
import { useShell } from "../../../_contexts/ShellContext";
import { useWallet } from "../../../_contexts/WalletContext";
import { useWalletBalance } from "../../../_services/wallet/hooks";
import { AmountInputPad } from "../../../_components/AmountInputPad";
import { useStaking } from "../../../_contexts/StakingContext";
import { useValidatorChange } from "@/app/_contexts/ShellContext/hooks";
import { useStakeMaxAmountBuffer, useStakeSpecificValidator } from "@/app/_contexts/StakingContext/hooks";
import { getIsAleoNetwork } from "../../../_services/aleo/utils";

export const StakeAmountInputPad = () => {
  const { network, validator } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountInputPad, setStates, inputErrorMessage, ctaState } = useStaking();
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({ address, network, activeWallet }) || {};
  const maxAmountBuffer = useStakeMaxAmountBuffer({ amount: balanceData || "0" });
  const isAleoNetwork = network && getIsAleoNetwork(network);
  const { validatorDetails } = useStakeSpecificValidator();
  const { onUpdateRouter } = useValidatorChange();

  return (
    <AmountInputPad
      type="stake"
      availableValue={balanceData}
      isAvailableValueLoading={isBalanceLoading}
      onValueChange={(val) => {
        setStates({ coinAmountInput: val });
        if (!!validator && val.length && ctaState === "invalidValidator") {
          onUpdateRouter(null);
        }
      }}
      maxAmountBuffer={maxAmountBuffer}
      error={inputErrorMessage}
      hideCurrencyConversion={isAleoNetwork === true}
      validatorInfo={
        validatorDetails?.validatorAddress
          ? {
              isLoading: validatorDetails.isLoading === true,
              name: validatorDetails.name || "",
              logo: validatorDetails.logo || "",
              address: validatorDetails.validatorAddress,
            }
          : undefined
      }
      {...amountInputPad}
    />
  );
};
