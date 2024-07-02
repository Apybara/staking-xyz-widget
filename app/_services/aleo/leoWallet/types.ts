import type { Wallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { AleoStakeProps, AleoUnstakeProps, AleoWithdrawProps } from "../types";

export type LeoWalletTxStatus =
  | "Queued"
  | "Generating Transaction"
  | "Broadcasting"
  | "Completed"
  | "Finalized"
  | "Failed";

export type LeoWalletStakeProps = AleoStakeProps & {
  wallet: Wallet;
};

export type LeoWalletUnstakeProps = AleoUnstakeProps & {
  wallet: Wallet;
};

export type LeoWalletWithdrawProps = AleoWithdrawProps & {
  wallet: Wallet;
};

export type LeoWalletTxStatusProps = {
  txId: string;
  wallet: Wallet | null;
};
