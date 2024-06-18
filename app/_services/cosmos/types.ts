import type { ChainWalletContext } from "@cosmos-kit/core";
import type { Network, CosmosNetwork, WalletType } from "../../types";

export type GetBalanceProps = {
  address: string | null;
  network: CosmosNetwork;
  getRpcEndpoint: ChainWalletContext["getRpcEndpoint"] | null;
};

export type CosmosTxParams = {
  amount?: string;
  network: Network | null;
  wallet: WalletType | null;
  address?: string | null;
};

export type CosmosTxStep = {
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash?: string) => void;
  onError?: (e: Error, txHash?: string) => void;
};
