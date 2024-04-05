"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useProceduralStates } from "../../_utils/hooks";
import { useWalletBalance, useWalletDisconnectors } from "../../_services/wallet/hooks";
import { useFormattedNetworkValue } from "../../_utils/conversions/hooks";
import { walletsInfo } from "../../consts";
import { RootWalletAccountDialog } from "./RootWalletAccountDialog";

export const WalletAccountDialog = () => {
  const { network, currency } = useShell();
  const { activeWallet, address } = useWallet();
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance({ address, network, activeWallet }) || {};
  const formattedBalance = useFormattedNetworkValue({ val: balanceData });
  const { isLoading, setIsLoading, error, setError } = useProceduralStates();
  const { open, toggleOpen } = useDialog("walletAccount");
  const disconnectors = useWalletDisconnectors(network || "celestia");

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
        isLoading: isBalanceLoading || false,
        error: balanceError || null,
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
            toggleOpen(false);
          }
        },
      }}
    />
  );
};
