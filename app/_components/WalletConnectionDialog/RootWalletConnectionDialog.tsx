import type { WalletInfo } from "../../types";
import { useMemo } from "react";
import cn from "classnames";
import Image from "next/image";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { CTAButton } from "../CTAButton";
import { MessageTag } from "../MessageTag";
import { LoadingSpinner } from "../LoadingSpinner";
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
  isOnMobileDevice?: boolean;
  onCancelConnection?: () => void;
};

export const RootWalletConnectionDialog = ({
  dialog,
  wallets,
  connection,
  isOnMobileDevice,
  onCancelConnection,
}: RootWalletConnectionDialogProps) => {
  const filteredWalletsByDevice = wallets.filter((wallet) =>
    wallet.devicesSupport.includes(isOnMobileDevice ? "mobile" : "desktop"),
  );

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content>
          <Dialog.Title className={cn(S.title)}>Select a wallet</Dialog.Title>
          <ul className={cn(S.list)}>
            {filteredWalletsByDevice.map((wallet) => (
              <li key={"walletDialog-" + wallet.id}>
                {wallet.isSupported ? (
                  <WalletCardButton connection={connection} wallet={wallet} />
                ) : (
                  <WalletInstallButton wallet={wallet} />
                )}
              </li>
            ))}
          </ul>
          {isOnMobileDevice && connection.isLoading && (
            <CTAButton variant="tertiary" onClick={onCancelConnection} className={cn(S.cancelButton)}>
              Cancel connection
            </CTAButton>
          )}
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
      {connection.error?.walletId === wallet.id && <MessageTag variant="warning">Faild</MessageTag>}
      {wallet.isConnected && <MessageTag variant="success">Connected</MessageTag>}
    </button>
  );
};

const WalletInstallButton = ({ wallet }: { wallet: Wallet }) => {
  return (
    <a className={cn(S.walletCardButton())} href={wallet.downloadLink} target="_blank" rel="noopener noreferrer">
      <div className={cn(S.walletInstallButtonInfo)}>
        <Image src={wallet.logo} width={24} height={24} alt={`Logo of ${wallet.name}`} style={{ opacity: 0.8 }} />
        <p>{wallet.name}</p>
      </div>
      <MessageTag variant="neutral">
        <span>Install</span>
        <Icon name="external-link" size={10} />
      </MessageTag>
    </a>
  );
};

type Wallet = WalletInfo & {
  isSupported: boolean;
  isConnecting: boolean;
  isConnected: boolean;
};
