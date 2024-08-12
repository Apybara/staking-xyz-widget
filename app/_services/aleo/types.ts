import type { Network, WalletType, AleoNetwork } from "../../types";
import type { TxStepCallbacks } from "../txProcedure/types";
import { LeoWalletNetworkIds, PuzzleNetworkIds } from "./consts";

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
  chainId?: AleoNetwork;
  validatorAddress: string;
  txFee: string;
};

export type AleoUnstakeProps = {
  amount: string;
  address: string;
  chainId?: AleoNetwork;
  txFee: string;
  instantWithdrawal?: boolean;
};

export type AleoWithdrawProps = {
  address: string;
  chainId?: AleoNetwork;
  txFee: string;
  amount?: string;
};

export type LeoWalletNetworkId = (typeof LeoWalletNetworkIds)[number];
export type PuzzleNetworkId = (typeof PuzzleNetworkIds)[number];
