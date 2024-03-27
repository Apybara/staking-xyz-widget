import type { GrazWalletType } from "./types";
import { grazWalletVariants } from "./consts";

export const getIsGrazWalletType = (walletType: string): walletType is GrazWalletType => {
  return grazWalletVariants.includes(walletType as GrazWalletType);
};
