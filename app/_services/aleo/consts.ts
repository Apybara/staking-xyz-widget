import { Network as PuzzleNetwork } from "@puzzlehq/sdk";
import { WalletAdapterNetwork as LeoNetworkId } from "@demox-labs/aleo-wallet-adapter-base";

export const LeoWalletNetworkIds: Array<LeoNetworkId> = [
  LeoNetworkId.MainnetBeta,
  LeoNetworkId.Testnet,
  LeoNetworkId.TestnetBeta,
] as const;
export const leoWalletNetworkIds = [...LeoWalletNetworkIds];

export const PuzzleNetworkIds = [PuzzleNetwork.AleoTestnet, PuzzleNetwork.AleoMainnet] as const;
export const puzzleNetworkIds = [...PuzzleNetworkIds];

export const aleoNetworkIdByWallet = {
  mainnet: {
    leoWallet: LeoNetworkId.MainnetBeta as LeoNetworkId,
    puzzle: PuzzleNetwork.AleoMainnet as PuzzleNetwork,
  },
  testnet: {
    leoWallet: LeoNetworkId.TestnetBeta as LeoNetworkId,
    puzzle: PuzzleNetwork.AleoTestnet as PuzzleNetwork,
  },
};
