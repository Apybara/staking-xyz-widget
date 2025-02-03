import type { ReactNode } from "react";
import { PuzzleWalletProvider as BasePuzzleWalletProvider } from "@puzzlehq/sdk";
import { PuzzleStatesProvider } from "./PuzzleStatesContext";

export const PuzzleWalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BasePuzzleWalletProvider>
      <PuzzleStatesProvider>{children}</PuzzleStatesProvider>
    </BasePuzzleWalletProvider>
  );
};
