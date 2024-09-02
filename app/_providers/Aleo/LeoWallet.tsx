import type { ReactNode } from "react";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { isAleoTestnet } from "@/app/consts";

export const LeoWalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WalletProvider
      wallets={aleoWallets}
      decryptPermission={DecryptPermission.UponRequest}
      // TODO: confirm Aleo mainnet network ID
      network={isAleoTestnet ? WalletAdapterNetwork.TestnetBeta : WalletAdapterNetwork.MainnetBeta}
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
