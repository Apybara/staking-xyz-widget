import type { WalletInfo } from "../../types";
import { useMemo } from "react";
import cn from "classnames";
import Image from "next/image";
import * as Dialog from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";
import { MessageTag } from "../MessageTag";
import * as S from "./walletConnectionDialog.css";

export type RootWalletConnectionDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  wallets: Array<Wallet>;
  connection: {
    isLoading: boolean;
    error?: {
      walletId: Wallet["id"];
      message: string;
    };
    onConnect: (wallet: WalletInfo) => void;
  };
};

export const RootWalletConnectionDialog = ({ dialog, wallets, connection }: RootWalletConnectionDialogProps) => {
  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content>
          <Dialog.Title className={cn(S.title)}>Select a wallet</Dialog.Title>
          <ul className={cn(S.list)}>
            {wallets.map((wallet) => (
              <li key={"walletDialog-" + wallet.id}>
                <WalletCardButton connection={connection} wallet={wallet} />
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};

const WalletCardButton = ({
  connection,
  wallet,
}: Pick<RootWalletConnectionDialogProps, "connection"> & {
  wallet: Wallet;
}) => {
  const connecting = connection.isLoading && wallet.isConnecting;
  const disabled = connection.isLoading && !wallet.isConnecting;
  const state = useMemo(() => {
    if (connecting) return "loading";
    if (disabled) return "disabled";
    return "default";
  }, [connecting, disabled]);

  return (
    <button
      className={cn(S.walletCardButton({ state }))}
      onClick={() => connection.onConnect(wallet)}
      disabled={disabled || connecting}
    >
      <div className={cn(S.walletCardButtonInfo)}>
        <Image src={wallet.logo} width={24} height={24} alt={`Logo of ${wallet.name}`} />
        <p>{wallet.name}</p>
      </div>
      {connecting && <LoadingSpinner />}
      {connection.error?.walletId === wallet.id && <MessageTag message="Failed" variant="warning" />}
    </button>
  );
};

type Wallet = WalletInfo & {
  isSupported: boolean;
  isConnecting: boolean;
};
