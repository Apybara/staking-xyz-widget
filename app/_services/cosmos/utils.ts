import type { Network, WalletType } from "../../types";
import type { Asset, AssetList } from "@chain-registry/types";
import type { CosmosNetwork } from "../../types";
import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { networkCurrency, cosmosNetworkVariants, cosmosWalletVariants } from "../../consts";

export const getIsCosmosNetwork = (network: string): network is Network => {
  return cosmosNetworkVariants.includes(network as Network);
};

export const getIsCosmosWalletType = (walletType: string): walletType is WalletType => {
  return cosmosWalletVariants.includes(walletType as WalletType);
};

export const getCoinValueFromDenom = ({ network, amount }: { network: CosmosNetwork; amount?: string | number }) => {
  const exponent = getExponent(network);
  return new BigNumber(amount || 0).multipliedBy(10 ** -exponent).toString();
};

export const getDenomValueFromCoin = ({ network, amount }: { network: CosmosNetwork; amount?: string | number }) => {
  const exponent = getExponent(network);
  return new BigNumber(amount || 0).multipliedBy(10 ** exponent).toString();
};

export const getChainAssets = (network: CosmosNetwork) => {
  return assets.find((chain) => chain.chain_name === network) as AssetList;
};

const getExponent = (network: CosmosNetwork) => {
  const coin = getCoin(network);
  return coin.denom_units.find((unit) => unit.denom === coin.display)?.exponent || 0;
};

const getCoin = (network: CosmosNetwork) => {
  const chainAssets = getChainAssets(network);
  const denomDisplayName = networkCurrency[network].toLowerCase();
  return chainAssets.assets.find((asset) => asset.display === denomDisplayName) as Asset;
};
