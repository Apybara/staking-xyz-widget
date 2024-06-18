import type { SigningStargateClient } from "@cosmjs/stargate";
import type { ChainWalletContext } from "@cosmos-kit/core";
import type { CosmosNetwork } from "../../types";

export type GetBalanceProps = {
  address: string | null;
  network: CosmosNetwork;
  getRpcEndpoint: ChainWalletContext["getRpcEndpoint"] | null;
};

export type CosmosTxParams = {
  client?: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string | null;
};

export type CosmosTxStep = {
  onPreparing?: () => void;
  onLoading?: () => void;
  onBroadcasting?: () => void;
  onSuccess?: (txHash?: string) => void;
  onError?: (e: Error, txHash?: string) => void;
};
