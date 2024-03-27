import type { cosmosKitWalletVariants } from "./consts";

export type CosmosKitWalletType = (typeof cosmosKitWalletVariants)[number];
