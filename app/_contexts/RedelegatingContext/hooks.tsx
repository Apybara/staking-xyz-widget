import type { RedelegatingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicRedelegateCtaValidation, getStakeFees } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import { useRedelegateMaxAmountBuffer } from "@/app/_services/redelegate/hooks";

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

  const buffer = useRedelegateMaxAmountBuffer({ amount });

  const amountValidation = getBasicAmountValidation({
    amount,
    min: "0",
    max: balanceData,
    buffer,
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
