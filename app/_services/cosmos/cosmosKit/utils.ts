import type { CosmosKitWalletType } from "./types";
import { cosmosKitWalletVariants } from "./consts";

export const getIsCosmosKitWalletType = (walletType: string): walletType is CosmosKitWalletType => {
  return cosmosKitWalletVariants.includes(walletType as CosmosKitWalletType);
};
