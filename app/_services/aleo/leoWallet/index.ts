import type { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import type * as T from "./types";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { aleoNetworkIdByWallet } from "../consts";
import { getCreditsToMicroCredits } from "../utils";

export const getLeoWalletTxStatus = async ({ txId, wallet }: T.LeoWalletTxStatusProps) => {
  try {
    const status = await (wallet.adapter as LeoWalletAdapter).transactionStatus(txId);
    return status as T.LeoWalletTxStatus;
  } catch (error) {
    throw error;
  }
};

export const leoWalletStake = async ({
  amount,
  validatorAddress,
  wallet,
  address,
  chainId = "aleo",
}: T.LeoWalletStakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "bond_public",
      [validatorAddress, address, transactionAmount],
      843_880,
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletUnstake = async ({ amount, wallet, address, chainId = "aleo" }: T.LeoWalletUnstakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "unbond_public",
      [transactionAmount],
      1_233_777,
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletWithdraw = async ({ wallet, address, chainId = "aleo" }: T.LeoWalletWithdrawProps) => {
  try {
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "claim_unbond_public",
      [],
      167_230,
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
