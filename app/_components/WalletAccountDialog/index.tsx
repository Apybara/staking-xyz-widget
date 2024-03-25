"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useWidget } from "../../_contexts/WidgetContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_services/hooks";
import { useWalletBalance, useWalletDisconnectors } from "../../_services/wallet/hooks";
import { useFormattedTokenPrice } from "../../_utils/conversions/hooks";
import { walletsInfo } from "../../consts";
import { RootWalletAccountDialog } from "./RootWalletAccountDialog";

export const WalletAccountDialog = () => {
  const { network, currency } = useWidget();
  const { activeWallet, address } = useWallet();
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance({ address, network, activeWallet });
  const formattedBalance = useFormattedTokenPrice({ val: balanceData });
  const { isLoading, setIsLoading, error, setError } = useProceduralStates();
  const { open, toggleOpen } = useDialog("walletAccount");
  const disconnectors = useWalletDisconnectors();

  if (!address || !activeWallet) {
    // TODO: HANDLE ERROR UI
    return null;
  }

  return (
    <RootWalletAccountDialog
      dialog={{
        open: !!open,
        onOpenChange: () => {
          toggleOpen(!open);
        },
      }}
      wallet={walletsInfo[activeWallet]}
      address={address}
      network={network || "celestia"}
      currency={currency || "USD"}
      balance={{
        isLoading: isBalanceLoading,
        error: balanceError,
        balance: formattedBalance,
      }}
      disconnection={{
        isLoading,
        error,
        onDisconnect: async () => {
          setIsLoading(true);

          try {
            await disconnectors[activeWallet]();
          } catch (e) {
            console.error(e);
            setError(e as Error);
          } finally {
            setIsLoading(false);
          }
        },
      }}
    />
  );
};
