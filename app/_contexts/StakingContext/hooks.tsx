import type { StakingStates } from "./types";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import {
  getBasicAmountValidation,
  getBasicTxCtaValidation,
  getStakeFees,
  getDenomValueFromCoinByNetwork,
} from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import { useStakeMaxAmountBuffer } from "../../_services/stake/hooks";

export const useStakeAmountInputValidation = ({ inputAmount }: { inputAmount: StakingStates["coinAmountInput"] }) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const castedNetwork = network || defaultNetwork;

  const denomAmount = getDenomValueFromCoinByNetwork({ network: castedNetwork, amount: inputAmount });
  const denomBalance = getDenomValueFromCoinByNetwork({ network: castedNetwork, amount: balanceData || "0" });
  const maxAmountBuffer = useStakeMaxAmountBuffer({ amount: denomAmount });

  const amountValidation = getBasicAmountValidation({
    amount: denomAmount,
    min: "0",
    max: denomBalance,
    buffer: maxAmountBuffer,
  });
  const ctaValidation = getBasicTxCtaValidation({
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { amountValidation, ctaValidation };
};

export const useStakeFees = ({ inputAmount }: { inputAmount: StakingStates["coinAmountInput"] }) => {
  const { network } = useShell();

  if (inputAmount === "" || inputAmount === "0") return undefined;
  return getStakeFees({ amount: inputAmount, network: network || defaultNetwork });
};
