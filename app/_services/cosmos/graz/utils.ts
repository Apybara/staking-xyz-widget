import type { WalletType } from "../../../types";
import type { GrazWalletType } from "./types";
import { WalletType as grazWalletType } from "graz";
import { grazWalletVariants } from "./consts";

export const getIsGrazWalletType = (walletType: string): walletType is GrazWalletType => {
  return grazWalletVariants.includes(walletType as GrazWalletType);
};

export const getGrazWalletTypeEnum = (walletType: WalletType | null) => {
  if (!walletType || !getIsGrazWalletType(walletType)) return undefined;

  switch (walletType) {
    case "walletConnect":
      return grazWalletType.WALLETCONNECT;
    case "keplrMobile":
      return grazWalletType.WC_KEPLR_MOBILE;
    case "leapMobile":
      return grazWalletType.WC_LEAP_MOBILE;
  }

  return undefined;
};
