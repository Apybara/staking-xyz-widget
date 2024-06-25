import type { AleoWalletNetworkIds } from "./types";
import type { AleoNetwork, AleoWalletType } from "@/app/types";
import { WalletAdapterNetwork as LeoNetworkId } from "@demox-labs/aleo-wallet-adapter-base";

export const LeoWalletNetworkIds: Array<LeoNetworkId> = [
  LeoNetworkId.MainnetBeta,
  LeoNetworkId.Testnet,
  LeoNetworkId.TestnetBeta,
] as const;
export const leoWalletNetworkIds = [...LeoWalletNetworkIds];

// NOTE:
// Puzzle's network IDs are not the same as Aleo's network IDs
// https://docs.puzzle.online/sdk-free/overview/#walletconnect-chain-ids
export const PuzzleNetworkIds = ["aleo:1"] as const;
export const puzzleNetworkIds = [...PuzzleNetworkIds];

// TODO: handle testnet and mainnet
export const aleoNetworkIdByWallet: Record<AleoNetwork, Record<AleoWalletType, AleoWalletNetworkIds>> = {
  aleo: {
    leoWallet: LeoNetworkId.TestnetBeta,
    puzzle: "aleo:1",
  },
};
