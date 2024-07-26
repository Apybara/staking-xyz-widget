import type { StakingStates } from "./types";
import type { BasicAmountValidationResult } from "../../_utils/transaction";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { useStakedBalance, useDelegatedValidator, useValidatorDetails } from "../../_services/stakingOperator/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import {
  defaultNetwork,
  requiredBalanceStakingByNetwork,
  minInitialStakingAmountByNetwork,
  minSubsequentStakingAmountByNetwork,
  networkWalletPrefixes,
  networkCurrency,
} from "@/app/consts";
import { getAddressChunks } from "@/app/_utils/address";

export const useStakeAmountInputValidation = ({
  inputAmount = "0",
}: {
  inputAmount: StakingStates["coinAmountInput"];
}) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const buffer = useStakeMaxAmountBuffer({ amount: inputAmount });
  const { minInitialAmount, minSubsequentAmount } = useStakeMinAmount();
  const { state: validatorState } = useStakeValidatorState();

  const amountValidation = getBasicAmountValidation({
    amount: inputAmount,
    min: (minInitialAmount || minSubsequentAmount).toString(),
    max: balanceData,
    bufferValidationAmount: BigNumber(inputAmount).plus(buffer).toString(),
    bufferValidationMax: balanceData,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
    closedValidator: validatorState === "closedValidator",
    closedDelegatedValidator: validatorState === "closedDelegatedValidator",
    invalidValidator: validatorState === "invalidValidator",
    differentValidator: validatorState === "differentValidator",
  });

  return { amountValidation, ctaValidation };
};

export const useStakeMaxAmountBuffer = ({ amount }: { amount: string }) => {
  const { network } = useShell();
  const castedNetwork = network || defaultNetwork;

  const requiredBalance = requiredBalanceStakingByNetwork[castedNetwork];
  // const collectedFee = getStakeFees({ amount, network: castedNetwork, floorResult: true });
  const collectedFee = 0;

  return BigNumber(requiredBalance)
    .plus(collectedFee || 0)
    .toString();
};

export const useStakeInputErrorMessage = ({ amountValidation }: { amountValidation: BasicAmountValidationResult }) => {
  const { network, stakingType } = useShell();
  const { minInitialAmount } = useStakeMinAmount();
  const defaultMessage = getDefaultInputErrorMessage({ amountValidation });
  const { state: validatorState } = useStakeValidatorState();
  const formattedValidatorAddress = useFormattedInvalidValidatorAddress();

  switch (network) {
    case "celestia":
    case "celestiatestnet3":
    case "cosmoshub":
    case "cosmoshubtestnet":
      return defaultMessage;
    case "aleo":
      switch (stakingType) {
        case "liquid":
          return defaultMessage;
        case "native":
          if (validatorState === "closedValidator") {
            return (
              <>
                You cannot stake with this validator at the moment. Please try another validator address.{" "}
                <a href={process.env.NEXT_PUBLIC_CLOSED_VALIDATOR_FAQ_LINK} target="_blank" rel="noreferrer">
                  (Learn why)
                </a>
              </>
            );
          }
          if (validatorState === "closedDelegatedValidator") {
            return (
              <>
                You cannot stake more to this position at the moment. To stake more, you need to unstake first and stake
                again.{" "}
                <a href={process.env.NEXT_PUBLIC_CLOSED_VALIDATOR_FAQ_LINK} target="_blank" rel="noreferrer">
                  (Learn why)
                </a>
              </>
            );
          }
          if (validatorState === "invalidValidator") {
            return `${formattedValidatorAddress} is an invalid validator address`;
          }
          if (validatorState === "differentValidator") {
            return "You are already staking with another validator. Please unstake first to stake with this validator.";
          }
          switch (amountValidation) {
            case "valid":
            case "empty":
            case "invalid":
              return undefined;
            case "insufficient":
              if (!!minInitialAmount) {
                return `You need to stake at least 10,000 ${networkCurrency.aleo} to begin.`;
              } else {
                return `You need to stake at least 1 ${networkCurrency.aleo}.`;
              }
            case "exceeded":
              return "Insufficient balance";
            case "bufferExceeded":
              return "Insufficient balance for fee";
          }
      }
  }
};

const getDefaultInputErrorMessage = ({ amountValidation }: { amountValidation: BasicAmountValidationResult }) => {
  switch (amountValidation) {
    case "valid":
    case "empty":
    case "invalid":
    case "insufficient":
      return undefined;
    case "exceeded":
      return "Insufficient balance";
    case "bufferExceeded":
      return "Insufficient balance for fee";
  }
};

const useStakeMinAmount = () => {
  const { network, stakingType } = useShell();
  const { stakedBalance } = useStakedBalance() || {};

  const isInitialStake = !stakedBalance || stakedBalance === "0";
  const minInitialAmount =
    isInitialStake && stakingType ? minInitialStakingAmountByNetwork[network || defaultNetwork][stakingType] : 0;
  const minSubsequentAmount =
    !isInitialStake && stakingType ? minSubsequentStakingAmountByNetwork[network || defaultNetwork][stakingType] : 0;

  return {
    minInitialAmount: minInitialAmount || 0,
    minSubsequentAmount: minSubsequentAmount || 0,
  };
};

export const useStakeValidatorState = () => {
  const { validator } = useShell();
  const { address } = useWallet();
  const { data: validatorDetails, isLoading: isLoadingValidatorDetails } =
    useValidatorDetails({ address: validator || undefined }) || {};
  const { data: delegatedValidator } = useDelegatedValidator({ address: address || "" }) || {};

  if (!validator && !!delegatedValidator && delegatedValidator.isOpen === false) {
    return {
      state: "closedDelegatedValidator",
      validatorDetails: undefined,
    };
  }

  if (!validator) {
    return {
      state: "empty",
      validatorDetails: undefined,
    };
  }

  const validatorInfo = {
    ...validatorDetails,
    isLoading: isLoadingValidatorDetails,
  };

  if (!!validator && isLoadingValidatorDetails === false) {
    if (!validatorDetails?.validatorAddress) {
      return {
        state: "invalidValidator",
        validatorDetails: undefined,
      };
    }
  }

  if (!delegatedValidator?.validatorAddress) {
    if (!validatorDetails?.isOpen) {
      return {
        state: "closedValidator",
        validatorDetails: validatorInfo,
      };
    }
    return {
      state: "success",
      validatorDetails: validatorInfo,
    };
  }
  if (validator !== delegatedValidator.validatorAddress) {
    return {
      state: "differentValidator",
      validatorDetails: validatorInfo,
    };
  }
  if (!validatorDetails?.isOpen) {
    return {
      state: "closedDelegatedValidator",
      validatorDetails: validatorInfo,
    };
  }
  return {
    state: "success",
    validatorDetails: validatorInfo,
  };
};

const useFormattedInvalidValidatorAddress = () => {
  const { network, validator } = useShell();

  const castedNetwork = network || defaultNetwork;
  const isAddressFormat = validator?.startsWith(networkWalletPrefixes[castedNetwork]);
  const { start, end, ellipsis } = getAddressChunks({
    address: validator || "",
    prefixString: networkWalletPrefixes[castedNetwork],
  });

  return isAddressFormat ? `${start}${ellipsis}${end}` : validator;
};
