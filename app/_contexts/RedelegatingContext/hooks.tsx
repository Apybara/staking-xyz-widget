import type { RedelegatingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import {
  getBasicAmountValidation,
  getBasicRedelegateCtaValidation,
  getStakeFees,
  getDenomValueFromCoinByNetwork,
} from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import { useStakeMaxAmountBuffer } from "../../_services/stake/hooks";

export const useRedelegateValidation = ({
  isAgreementChecked,
  amount,
}: {
  isAgreementChecked: boolean;
  amount: RedelegatingStates["redelegateAmount"];
}) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const castedNetwork = network || defaultNetwork;

  const denomAmount = getDenomValueFromCoinByNetwork({ network: castedNetwork, amount: amount });
  const maxAmountBuffer = useStakeMaxAmountBuffer({ amount: denomAmount });

  const amountValidation = getBasicAmountValidation({
    amount,
    min: "0",
    max: balanceData,
    buffer: maxAmountBuffer,
  });

  const ctaValidation = getBasicRedelegateCtaValidation({
    isAgreementChecked,
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { ctaValidation };
};

export const useStakeFees = ({ inputAmount }: { inputAmount: RedelegatingStates["redelegateAmount"] }) => {
  const { network } = useShell();

  if (inputAmount === "" || inputAmount === "0") return undefined;
  return getStakeFees({ amount: inputAmount, network: network || defaultNetwork });
};
