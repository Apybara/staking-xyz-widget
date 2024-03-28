import type { CosmosKitWalletVariants } from "./consts";

export type CosmosKitWalletType = (typeof CosmosKitWalletVariants)[number];
