import type { StakingStates } from "./types";
import type { BasicAmountValidationResult } from "../../_utils/transaction";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { useStakedBalance } from "../../_services/stakingOperator/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import {
  defaultNetwork,
  requiredBalanceStakingByNetwork,
  minInitialStakingAmountByNetwork,
  minSubsequentStakingAmountByNetwork,
} from "@/app/consts";

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
          switch (amountValidation) {
            case "valid":
            case "empty":
            case "invalid":
              return undefined;
            case "insufficient":
              if (!!minInitialAmount) {
                return "You need to stake at least 10,000 Credits to begin.";
              } else {
                return "You need to stake at least 1 Credit.";
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
