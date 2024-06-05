import type { ChainInfo } from "@keplr-wallet/types";
import type { CosmosNetwork } from "../../../types";
import { celestiaChainInfo, celestiatestnet3ChainInfo, cosmoshubChainInfo, cosmoshubtestnetChainInfo } from "../consts";

export const GrazWalletVariants = ["walletConnect"] as const;
export const grazWalletVariants = [...GrazWalletVariants];

export const chainInfo: Record<CosmosNetwork, ChainInfo> = {
  celestia: celestiaChainInfo,
  celestiatestnet3: celestiatestnet3ChainInfo,
  cosmoshub: cosmoshubChainInfo,
  cosmoshubtestnet: cosmoshubtestnetChainInfo,
};
