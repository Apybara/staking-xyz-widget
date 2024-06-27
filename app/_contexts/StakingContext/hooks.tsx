import type { StakingStates } from "./types";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicTxCtaValidation } from "../../_utils/transaction";
import { defaultNetwork, minimumStakingAmountByNetwork, requiredBalanceStakingByNetwork } from "@/app/consts";
import { useStakedBalance } from "@/app/_services/stakingOperator/hooks";

export const useStakeAmountInputValidation = ({
  inputAmount = "0",
}: {
  inputAmount: StakingStates["coinAmountInput"];
}) => {
  const { network, stakingType } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const { stakedBalance } = useStakedBalance() || {};

  const castedNetwork = network || defaultNetwork;

  const isFirstTime = !stakedBalance || stakedBalance === "0";
  const buffer = useStakeMaxAmountBuffer({ amount: inputAmount });
  const minAmount = stakingType
    ? isFirstTime
      ? minimumStakingAmountByNetwork[castedNetwork][stakingType] || 1
      : 1
    : 0;

  const amountValidation = getBasicAmountValidation({
    isFirstTime,
    amount: inputAmount,
    min: minAmount.toString(),
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
