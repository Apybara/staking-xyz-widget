import { assets, chains } from "chain-registry";
import celestiatestnet3Chains from "../celestiatestnet3/chain.json";
import celestiatestnet3AssetList from "../celestiatestnet3/assetlist.json";

export const CosmosKitWalletVariants = ["keplr", "leap", "okx"] as const;
export const cosmosKitWalletVariants = [...CosmosKitWalletVariants];

export const cosmosKitChains = [
  chains.filter((chain) => chain.chain_id === "celestia")[0] || "celestia",
  celestiatestnet3Chains,
];
export const cosmosKitAssets = [
  assets.filter((asset) => asset.chain_name === "celestia")[0],
  celestiatestnet3AssetList,
];
