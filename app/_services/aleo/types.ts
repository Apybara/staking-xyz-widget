import type { Wallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { Network, WalletType } from "../../types";
import type { TxStepCallbacks } from "../txProcedure/types";
import { LeoWalletNetworkIds, PuzzleNetworkIds } from "./consts";

export type AleoInstanceChainId = "mainnet" | "testnet";

export type AleoTxStatus = "loading" | "error" | "success";

export type AleoTxStatusResponse = {
  status: AleoTxStatus;
  txId?: string;
};

export type AleoWalletNetworkIds = LeoWalletNetworkId | PuzzleNetworkId;

export type AleoTxParams = {
  amount?: string;
  network: Network | null;
  wallet: WalletType | null;
  address?: string | null;
};

export type AleoTxStep = TxStepCallbacks;

export type AleoStakeProps = {
  amount: string;
  address: string;
  chainId?: AleoInstanceChainId;
  validatorAddress: string;
  txFee?: string;
  aleoToPAleoRate: number;
};

export type AleoUnstakeProps = {
  amount: string;
  address: string;
  chainId?: AleoInstanceChainId;
  txFee?: string;
  pAleoToAleoRate: number;
  instantWithdrawal?: boolean;
};

export type AleoWithdrawProps = {
  address: string;
  chainId?: AleoInstanceChainId;
  txFee?: string;
  amount?: string;
};

export type GetTxResultProps = {
  txId: string;
  wallet: WalletType | null;
  leoWallet: Wallet | null;
  address: string;
  network: AleoStakeProps["chainId"];
};

export type LeoWalletNetworkId = (typeof LeoWalletNetworkIds)[number];
export type PuzzleNetworkId = (typeof PuzzleNetworkIds)[number];
