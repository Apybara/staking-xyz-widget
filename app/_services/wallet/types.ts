import type { WalletType, Network } from "../../types";
import type { WalletStates } from "../../_contexts/WalletContext/types";

export type UseWalletConnectors = (network: Network) => Record<WalletType, Connector | null>;
export type UseWalletDisconnectors = (network: Network) => Record<WalletType, Disconnector>;

export type UseWalletBalance = ({ address }: { address: string }) => {
  isLoading: boolean;
  error: Error | null;
  balance: string | null;
};

export type UseWalletBalanceGetters = (props: UseWalletBalanceGettersProps) => Record<Network, BalanceGetter>;

export type UseWalletBalanceGettersProps = {
  address: string | null;
  network: Network | null;
  activeWallet: WalletStates["activeWallet"];
};

export type BalanceGetter = () => Promise<string>;

type Connector = () => Promise<void>;
type Disconnector = () => Promise<void>;
