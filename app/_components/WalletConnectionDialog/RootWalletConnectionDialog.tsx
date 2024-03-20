import type { WalletInfo } from "../../types";
import cn from "classnames";
import Image from "next/image";
import * as Dialog from "../Dialog";
import * as S from "./walletConnectionDialog.css";

export type RootWalletConnectionDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  wallets: Array<
    WalletInfo & {
      isSupported: boolean;
      isConnecting: boolean;
    }
  >;
  connection: {
    isLoading: boolean;
    error: Error | null;
    onConnect: (wallet: WalletInfo) => void;
  };
};

export const RootWalletConnectionDialog = ({ dialog, wallets, connection }: RootWalletConnectionDialogProps) => {
  const hasConnectingWallet = wallets.some((wallet) => wallet.isConnecting);

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content>
          <Dialog.Title className={cn(S.title)}>Select a wallet</Dialog.Title>
          <ul className={cn(S.list)}>
            {wallets.map((wallet) => (
              <li key={"walletDialog-" + wallet.id}>
                <button
                  className={cn(S.walletCardButton)}
                  onClick={() => connection.onConnect(wallet)}
                  disabled={hasConnectingWallet && !wallet.isConnecting}
                >
                  <Image src={wallet.logo} width={24} height={24} alt={`Logo of ${wallet.name}`} />
                  <p>{wallet.name}</p>
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
