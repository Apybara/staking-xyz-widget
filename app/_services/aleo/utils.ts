import type { AleoNetwork, AleoWalletType } from "@/app/types";
import BigNumber from "bignumber.js";
import { aleoNetworkVariants, aleoWalletVariants } from "@/app/consts";

export const getIsAleoNetwork = (network: string): network is AleoNetwork => {
  return aleoNetworkVariants.includes(network as AleoNetwork);
};

export const getIsAleoWalletType = (walletType: string): walletType is AleoWalletType => {
  return aleoWalletVariants.includes(walletType as AleoWalletType);
};

export const getMicroCreditsToCredits = (microCredits: string | number) => {
  return BigNumber(microCredits).div(TOKEN_CONVERSION_FACTOR).toNumber();
};

export const getCreditsToMicroCredits = (credits: string | number) => {
  return BigNumber(credits).times(TOKEN_CONVERSION_FACTOR).toNumber();
};

const TOKEN_CONVERSION_FACTOR = Math.pow(10, 6); // 1,000,000
