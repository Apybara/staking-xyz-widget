import type { RedelegatingStates } from "./types";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { getFeeCollectingAmount, getGasFeeEstimationAmount } from "../../_services/redelegate";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicRedelegateCtaValidation, getStakeFees } from "../../_utils/transaction";
import { defaultNetwork } from "../../consts";
import BigNumber from "bignumber.js";

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

  const gasFeeEstimate = getGasFeeEstimationAmount({ amount, network: network || defaultNetwork });
  const feesCollecting = getFeeCollectingAmount({ amount, network: network || defaultNetwork });

  const amountValidation = getBasicAmountValidation({
    amount,
    min: "0",
    max: balanceData,
    buffer: BigNumber(gasFeeEstimate).plus(BigNumber(feesCollecting)).toString(),
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
