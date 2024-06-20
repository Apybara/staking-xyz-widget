import type { ReactNode } from "react";
import { PuzzleWalletProvider as BasePuzzleWalletProvider } from "@puzzlehq/sdk";
import { PuzzleStatesProvider } from "./PuzzleStatesContext";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_WALLET_CONNECT_LOGO } from "../../../consts";

export const PuzzleWalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BasePuzzleWalletProvider
      dAppName={SITE_TITLE}
      dAppDescription={SITE_DESCRIPTION}
      dAppUrl={SITE_URL}
      dAppIconURL={SITE_WALLET_CONNECT_LOGO}
    >
      <PuzzleStatesProvider>{children}</PuzzleStatesProvider>
    </BasePuzzleWalletProvider>
  );
};
