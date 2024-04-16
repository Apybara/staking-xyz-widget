import type { WalletInfo } from "../../types";
import { useMemo, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "../Icon";
import * as Dialog from "../Dialog";
import { CTAButton } from "../CTAButton";
import { MessageTag } from "../MessageTag";
import { LoadingSpinner } from "../LoadingSpinner";
import * as S from "./walletConnectionDialog.css";
import { Checkbox } from "../Checkbox";

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

export type WalletCardButtonProps = {
  wallet: Wallet;
  isAgreementChecked: boolean;
};

export const RootWalletConnectionDialog = ({
  dialog,
  wallets,
  connection,
  isOnMobileDevice,
  onCancelConnection,
}: RootWalletConnectionDialogProps) => {
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const filteredWalletsByDevice = wallets.filter((wallet) =>
    wallet.devicesSupport.includes(isOnMobileDevice ? "mobile" : "desktop"),
  );

  const handleAgreement = (isChecked: boolean) => {
    setIsAgreementChecked(isChecked);
    !isChecked && onCancelConnection?.();
  };

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content>
          <Dialog.Title className={cn(S.title)}>Select a wallet</Dialog.Title>

          <Checkbox
            checked={isAgreementChecked}
            onChange={({ target }) => handleAgreement(target.checked)}
            label={
              <>
                Agree to <Link href="#">Privacy</Link> and <Link href="#">Terms</Link>
              </>
            }
          />

          <ul className={cn(S.list)}>
            {filteredWalletsByDevice.map((wallet) => (
              <li key={"walletDialog-" + wallet.id} className={cn(S.walletItem)}>
                {wallet.isSupported ? (
                  <WalletCardButton
                    connection={connection}
                    wallet={wallet}
                    isOnMobileDevice={isOnMobileDevice}
                    isAgreementChecked={isAgreementChecked}
                    onCancelConnection={onCancelConnection}
                  />
                ) : (
                  <WalletInstallButton wallet={wallet} isAgreementChecked={isAgreementChecked} />
                )}
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
  isOnMobileDevice,
  isAgreementChecked,
  onCancelConnection,
}: Pick<RootWalletConnectionDialogProps, "connection" | "isOnMobileDevice" | "onCancelConnection"> &
  WalletCardButtonProps) => {
  const connecting = connection.isLoading && wallet.isConnecting;
  const disabled = !isAgreementChecked || (connection.isLoading && !wallet.isConnecting);
  const showCancel = (isOnMobileDevice || wallet.id === "okx") && connection.isLoading && wallet.isConnecting;
  const state = useMemo(() => {
    if (disabled) return "disabled";
    if (connecting) return "loading";
    return "default";
  }, [connecting, disabled]);

  return (
    <>
      <button
        className={cn(S.walletCardButton({ state, hasCancelButton: showCancel }))}
        onClick={() => connection.onConnect(wallet)}
        disabled={disabled || connecting}
      >
        <div className={cn(S.walletCardButtonInfo)}>
          <Image src={wallet.logo} width={24} height={24} alt={`Logo of ${wallet.name}`} />
          <p>{wallet.name}</p>
        </div>
        {connecting && <LoadingSpinner />}
        {connection.error?.walletId === wallet.id && <MessageTag variant="warning">Failed</MessageTag>}
        {wallet.isConnected && <MessageTag variant="success">Connected</MessageTag>}
      </button>
      {showCancel && (
        <button onClick={onCancelConnection} className={cn(S.cancelButton)}>
          <Icon name="cross" size={14} />
        </button>
      )}
    </>
  );
};

const WalletInstallButton = ({ wallet, isAgreementChecked }: WalletCardButtonProps) => {
  return (
    <a
      className={cn(S.walletCardButton({ state: isAgreementChecked ? "default" : "disabled" }))}
      href={wallet.downloadLink}
      target="_blank"
      rel="noopener noreferrer"
    >
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
