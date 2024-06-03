import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { getBasicAmountValidation, getBasicRedelegateCtaValidation } from "../../_utils/transaction";
import { useExternalDelegations } from "@/app/_services/stakingOperator/hooks";
import { defaultNetwork, requiredBalanceUnstakingByNetwork } from "@/app/consts";

export const useRedelegateValidation = ({ isAgreementChecked }: { isAgreementChecked: boolean }) => {
  const { network } = useShell();
  const { address, activeWallet, connectionStatus } = useWallet();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const externalDelegations = useExternalDelegations();
  const { redelegationAmount } = externalDelegations?.data || {};
  const amount = redelegationAmount || "0";

  const amountValidation = getBasicAmountValidation({
    amount,
    min: "0",
    max: amount,
    bufferValidationAmount: requiredBalanceUnstakingByNetwork[network || defaultNetwork].toString(),
    bufferValidationMax: balanceData,
  });

  const ctaValidation = getBasicRedelegateCtaValidation({
    isAgreementChecked,
    amountValidation,
    walletConnectionStatus: connectionStatus,
  });

  return { ctaValidation };
};
