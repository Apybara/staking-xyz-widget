import type { ReactNode } from "react";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

export const LeoWalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WalletProvider
      wallets={aleoWallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect
    >
      {children}
    </WalletProvider>
  );
};

const aleoWallets = [
  new LeoWalletAdapter({
    appName: "Staking_XYZ",
  }),
];
