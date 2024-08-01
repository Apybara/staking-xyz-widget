import BigNumber from "bignumber.js";
import type { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import type * as T from "./types";
import { Transaction } from "@demox-labs/aleo-wallet-adapter-base";
import { aleoNetworkIdByWallet } from "../consts";
import { getCreditsToMicroCredits, getCreditsToMint } from "../utils";
import {
  aleoDefaultClaimFee,
  aleoDefaultLiquidClaimFee,
  aleoDefaultLiquidStakeFee,
  aleoDefaultLiquidUnstakeFee,
  aleoDefaultStakeFee,
  aleoDefaultUnstakeFee,
} from "@/app/consts";

export const getLeoWalletTxStatus = async ({
  txId,
  wallet,
}: T.LeoWalletTxStatusProps): Promise<AleoTxStatusResponse> => {
  try {
    if (!wallet) {
      return {
        status: "error",
        txId: undefined,
      };
    }

    const res = (await (wallet.adapter as LeoWalletAdapter).transactionStatus(txId)) as T.LeoWalletTxStatus;
    return {
      status: getLeoWalletFormattedStatus({ status: res }),
      txId: undefined,
    };
  } catch (error) {
    return {
      status: "error",
      txId: undefined,
    };
  }
};
const getLeoWalletFormattedStatus = ({ status }: { status: T.LeoWalletTxStatus }): AleoTxStatus => {
  // TODO: because Leo Wallet tx is unstable,
  // unsure if we should use the "Completed" status to determine the success of the tx.
  // if (!(status === "Completed" || status === "Finalized" || status === "Failed")) {
  //   return "loading";
  // }
  // if (status === "Completed" || status === "Finalized") {
  //   return "success";
  // }

  // Proving stage
  if (!(status === "Finalized" || status === "Failed")) {
    return "loading";
  }

  // Completed stage
  if (status === "Finalized") {
    return "success";
  }

  // Failed tx
  return "error";
};

const getLeoWalletFormattedTxFee = (fee: string) => {
  return BigNumber(fee).toNumber();
};

export const leoWalletStake = async ({
  amount,
  validatorAddress,
  wallet,
  address,
  chainId = "aleo",
  txFee,
}: T.LeoWalletStakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "bond_public",
      [validatorAddress, address, transactionAmount],
      getLeoWalletFormattedTxFee(txFee || aleoDefaultStakeFee),
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletLiquidStake = async ({
  amount,
  wallet,
  address,
  chainId = "aleo",
  txFee,
}: T.LeoWalletStakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const transactionMintAmount = getCreditsToMicroCredits(getCreditsToMint(amount)) + "u64";

    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "deposit_public_as_signer",
      [transactionAmount, transactionMintAmount, address],
      getLeoWalletFormattedTxFee(aleoDefaultLiquidStakeFee),
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletUnstake = async ({
  amount,
  wallet,
  address,
  chainId = "aleo",
  txFee,
}: T.LeoWalletUnstakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "unbond_public",
      [address, transactionAmount],
      getLeoWalletFormattedTxFee(txFee || aleoDefaultUnstakeFee),
      false,
    );

    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletLiquidUnstake = async ({
  amount,
  wallet,
  address,
  chainId = "aleo",
  txFee,
}: T.LeoWalletUnstakeProps) => {
  try {
    const transactionMintAmount = getCreditsToMicroCredits(getCreditsToMint(amount)) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "withdraw_public",
      [transactionMintAmount],
      getLeoWalletFormattedTxFee(aleoDefaultLiquidUnstakeFee),
      false,
    );

    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletWithdraw = async ({ wallet, address, chainId = "aleo", txFee }: T.LeoWalletWithdrawProps) => {
  try {
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "credits.aleo",
      "claim_unbond_public",
      [address],
      getLeoWalletFormattedTxFee(txFee || aleoDefaultClaimFee),
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletLiquidWithdraw = async ({
  wallet,
  address,
  chainId = "aleo",
  txFee,
  amount,
}: T.LeoWalletWithdrawProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount as string) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "claim_withdrawal_public",
      [address, transactionAmount],
      getLeoWalletFormattedTxFee(aleoDefaultLiquidClaimFee),
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
