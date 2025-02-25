import type { WalletInfo, Network, Currency } from "../../types";
import cn from "classnames";
import Image from "next/image";
import { networkWalletPrefixes, networkCurrency } from "../../consts";
import * as Dialog from "../Dialog";
import { Skeleton } from "../Skeleton";
import { CopyButton } from "../CopyButton";
import { CTAButton, Loader } from "../CTAButton";
import { FormattedAddress } from "../FormattedAddress";
import * as S from "./walletAccountDialog.css";

export type RootWalletAccountDialogProps = {
  dialog: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  wallet: WalletInfo;
  address: string;
  network: Network;
  balance: {
    isLoading: boolean;
    error: Error | null;
    balance?: string;
  };
  disconnection: {
    isLoading: boolean;
    error: Error | null;
    onDisconnect: () => void;
  };
};

export const RootWalletAccountDialog = ({
  dialog,
  wallet,
  address,
  balance,
  network,
  disconnection,
}: RootWalletAccountDialogProps) => {
  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.onOpenChange}>
      <Dialog.Main>
        <Dialog.Content className={cn(S.main)}>
          <div className={cn(S.logoWrapper)}>
            <Image src={wallet.logo} width={56} height={56} alt={`Logo of ${wallet.name}`} />
          </div>
          <AccountBox address={address} balance={balance} network={network} />
          <CTAButton
            variant="tertiary"
            state={disconnection.isLoading ? "loading" : "default"}
            onClick={() => disconnection.onDisconnect()}
            disabled={disconnection.isLoading}
          >
            {disconnection.isLoading ? "Disconnecting" : "Disconnect"}
            {disconnection.isLoading && <Loader />}
          </CTAButton>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};

const AccountBox = ({
  address,
  balance,
  network,
}: Pick<RootWalletAccountDialogProps, "address" | "balance" | "network">) => {
  return (
    <div className={cn(S.accountBox)}>
      <div className={cn(S.addressBox)}>
        <FormattedAddress address={address} prefixString={networkWalletPrefixes[network]} />
        <CopyButton content={address} />
      </div>
      <p className={cn(S.balanceBox)}>
        {balance.isLoading ? (
          <Skeleton width={64} />
        ) : (
          <>
            <span>{balance.error ? "N/A" : balance.balance}</span>
          </>
        )}
      </p>
    </div>
  );
};
