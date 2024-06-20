import type { ReactNode } from "react";
import { LeoWalletProvider } from "./LeoWallet";
import { PuzzleWalletProvider } from "./Puzzle";

export const AleoProviders = ({ children }: { children: ReactNode }) => {
  return (
    <LeoWalletProvider>
      <PuzzleWalletProvider>{children}</PuzzleWalletProvider>
    </LeoWalletProvider>
  );
};
