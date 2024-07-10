"use client";
import { useDialog } from "../../_contexts/UIContext";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useActiveWalletStates } from "../../_contexts/WalletContext/hooks";
import { useProceduralStates } from "../../_utils/hooks";
import { usePostHogEvent } from "../../_services/postHog/hooks";
import { useWalletBalance, useWalletDisconnectors } from "../../_services/wallet/hooks";
import { useRouter } from "next/navigation";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import { useFormattedNetworkValue } from "../../_utils/conversions/hooks";
import { walletsInfo, defaultNetwork } from "../../consts";
import { RootWalletAccountDialog } from "./RootWalletAccountDialog";

export const WalletAccountDialog = () => {
  const router = useRouter();
  const { network } = useShell();
  const { activeWallet, address, setStates } = useWallet();
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance({ address, network, activeWallet }) || {};
  const formattedBalance = useFormattedNetworkValue({ val: balanceData });
  const { isLoading, setIsLoading, error, setError } = useProceduralStates();
  const { open, toggleOpen } = useDialog("walletAccount");
  const disconnectors = useWalletDisconnectors(network || defaultNetwork);
  const homePageLink = useLinkWithSearchParams("");

  // NOTE: triggering this hook here to ensure CosmosKit wallet status are updated.
  // The `useCosmosWalletStates` hook triggered in WalletContext doesn't update the status for unknown reasons.
  useActiveWalletStates({ setStates });

  const captureDisconnectSuccess = usePostHogEvent("wallet_disconnect_succeeded");

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
      network={network || defaultNetwork}
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
            captureDisconnectSuccess({ wallet: activeWallet, address });
          } catch (e) {
            console.error(e);
            setError(e as Error);
          } finally {
            setIsLoading(false);
            toggleOpen(false);
            router.push(homePageLink);
          }
        },
      }}
    />
  );
};
