import type { Network, WalletInfo } from "../../types";
import Image from "next/image";
import cn from "classnames";
import { networkWalletPrefixes } from "../../consts";
import { FormattedAddress } from "../FormattedAddress";
import * as S from "./walletCapsule.css";

export type RootWalletCapsuleProps = {
  className?: string;
  state: "disconnected" | "connecting" | "connected";
  wallet?: {
    info: WalletInfo;
    address: string;
  };
  network: Network;
  onButtonClick: () => void;
};

export const RootWalletCapsule = ({ state, wallet, network, className, onButtonClick }: RootWalletCapsuleProps) => {
  return (
    <button className={cn(S.button, className)} disabled={state === "connecting"} onClick={onButtonClick}>
      <MainContent state={state} wallet={wallet} network={network} />
    </button>
  );
};

const MainContent = ({ state, wallet, network }: Pick<RootWalletCapsuleProps, "state" | "wallet" | "network">) => {
  if (state === "disconnected") {
    return <p className={cn(S.defaultButtonText)}>Connect wallet</p>;
  }
  if (state === "connecting") {
    return <p className={cn(S.connectingButtonText)}>Connecting</p>;
  }

  if (wallet && state === "connected") {
    return (
      <div className={cn(S.account)}>
        <Image src={wallet.info.logo} width={18} height={18} alt={`Logo of ${wallet.info.name}`} />
        <FormattedAddress address={wallet.address} prefixString={networkWalletPrefixes[network]} />
      </div>
    );
  }

  return null;
};
