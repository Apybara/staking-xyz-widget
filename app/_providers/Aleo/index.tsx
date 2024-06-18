import type { ReactNode } from "react";
import { LeoWalletProvider } from "./LeoWallet";

export const AleoProviders = ({ children }: { children: ReactNode }) => {
  return <LeoWalletProvider>{children}</LeoWalletProvider>;
};
