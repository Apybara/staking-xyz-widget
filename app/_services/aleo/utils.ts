import type { AleoNetwork, AleoWalletType } from "@/app/types";
import BigNumber from "bignumber.js";
import { aleoNetworkVariants, aleoWalletVariants, networkCurrency } from "@/app/consts";
import { assets } from "chain-registry";
import { Asset, AssetList } from "@chain-registry/types";

export const getIsAleoNetwork = (network: string | null): network is AleoNetwork => {
  return aleoNetworkVariants.includes(network as AleoNetwork);
};

export const getIsAleoWalletType = (walletType: string): walletType is AleoWalletType => {
  return aleoWalletVariants.includes(walletType as AleoWalletType);
};

export const getIsAleoAddressFormat = (address: string): boolean => {
  if (typeof address !== "string") return false;
  if (!address) return false;
  if (address.length !== 63 || !address.startsWith("aleo")) return false;

  return getIsBech32(address);
};

export const getCoinValueFromDenom = ({ network, amount }: { network: AleoNetwork; amount?: string | number }) => {
  const exponent = getExponent(network);
  return new BigNumber(amount || 0).multipliedBy(10 ** -exponent).toString();
};

export const getChainAssets = (network: AleoNetwork) => {
  return assets.find((chain) => chain.chain_name === network) as AssetList;
};

const getExponent = (network: AleoNetwork) => {
  const coin = getCoin(network);
  return coin?.denom_units?.find((unit) => unit.denom === coin.display)?.exponent || 0;
};

const getCoin = (network: AleoNetwork) => {
  const chainAssets = getChainAssets(network);
  const denomDisplayName = networkCurrency[network].toLowerCase();
  return chainAssets?.assets.find((asset) => asset.display === denomDisplayName) as Asset;
};

export const getMicroCreditsToCredits = (microCredits: string | number) => {
  return BigNumber(microCredits).div(TOKEN_CONVERSION_FACTOR).toNumber();
};

export const getCreditsToMicroCredits = (credits: string | number) => {
  return BigNumber(credits).times(TOKEN_CONVERSION_FACTOR).toNumber();
};

export const getMintToCredits = (mint: string | number, rate: number) => {
  return BigNumber(mint)
    .div(rate || "1")
    .toNumber();
};

export const getCreditsToMint = (credits: string | number, rate: number) => {
  return BigNumber(credits)
    .times(rate || "1")
    .toNumber();
};

export const getInstantWithdrawalFee = (unstakeAmount: string | number, txFee: string | number, rate?: number) => {
  return BigNumber(unstakeAmount)
    .times(INSTANT_WITHDRAWAL_FEE)
    .dividedBy(rate || "1")
    .plus(txFee)
    .toNumber();
};

const TOKEN_CONVERSION_FACTOR = Math.pow(10, 6); // 1,000,000
const INSTANT_WITHDRAWAL_FEE = 0.00025;

const getIsBech32 = (address?: string) => {
  if (!address) return false;

  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  const separator = "1";

  // Length Check
  if (address.length < 14 || address.length > 74) return false;

  // Lowercase/Uppercase Check
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;

  // Find Separator
  const separatorIndex = address.lastIndexOf(separator);
  if (separatorIndex === -1) return false;

  // Check Human-Readable Part
  const hrp = address.slice(0, separatorIndex);
  if (!hrp) return false;

  // Check Data Part
  const data = address.slice(separatorIndex + 1);
  for (let i = 0; i < data.length; i++) {
    if (charset.indexOf(data[i]?.toLowerCase() as string) === -1) return false;
  }

  return true;
};
