import { assets, chains } from "chain-registry";

export const CosmosKitWalletVariants = ["keplr", "leap", "okx", "keplrMobile", "leapMobile"] as const;
export const cosmosKitWalletVariants = [...CosmosKitWalletVariants];

export const cosmosKitChains = [
  chains.filter((chain) => chain.chain_id === "celestia")[0] || "celestia",
  chains.filter((chain) => chain.chain_id === "mocha-4")[0] || "mocha-4",
  chains.filter((chain) => chain.chain_id === "cosmoshub-4")[0] || "cosmoshub-4",
  chains.filter((chain) => chain.chain_id === "theta-testnet-001")[0] || "theta-testnet-001",
];
export const cosmosKitAssets = [
  assets.filter((asset) => asset.chain_name === "celestia")[0],
  assets.filter((asset) => asset.chain_name === "celestiatestnet3")[0],
  assets.filter((asset) => asset.chain_name === "cosmoshub")[0],
  assets.filter((asset) => asset.chain_name === "cosmoshubtestnet")[0],
];
