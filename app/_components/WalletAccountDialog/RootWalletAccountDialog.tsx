import type { WalletInfo, Network, Currency } from "../../types";
import cn from "classnames";
import Image from "next/image";
import { networkWalletPrefixes, networkDenom } from "../../consts";
import * as Dialog from "../Dialog";
import { CTAButton, Loader } from "../CTAButton";
import { CopyButton } from "../CopyButton";
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
  currency: Currency;
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
  currency,
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
          <AccountBox address={address} balance={balance} network={network} currency={currency} />
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
  currency,
}: Pick<RootWalletAccountDialogProps, "address" | "balance" | "network" | "currency">) => {
  const unit = currency === networkDenom[network] ? networkDenom[network] : currency;

  return (
    <div className={cn(S.accountBox)}>
      <div className={cn(S.addressBox)}>
        <FormattedAddress address={address} prefixString={networkWalletPrefixes[network]} />
        <CopyButton content={address} />
      </div>
      <p className={cn(S.balanceBox)}>
        <span>{balance.balance}</span> <span>{unit}</span>
      </p>
    </div>
  );
};
