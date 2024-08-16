import BigNumber from "bignumber.js";
import type { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import type * as T from "./types";
import { Transaction } from "@demox-labs/aleo-wallet-adapter-base";
import { aleoNetworkIdByWallet } from "../consts";
import { getCreditsToMicroCredits, getCreditsToMint } from "../utils";
import { aleoDefaultClaimFee, aleoDefaultStakeFee, aleoDefaultUnstakeFee, aleoFees } from "@/app/consts";
import { getLiquidFees } from "@/app/_utils/transaction";

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
      getLeoWalletFormattedTxFee(txFee || aleoFees.stake.native),
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletLiquidStake = async ({
  amount = "0",
  wallet,
  address,
  chainId = "aleo",
  mintRate,
}: T.LeoWalletStakeProps) => {
  try {
    const txFee = getLiquidFees({ amount, type: "stake" });
    const txFeeMicro = getCreditsToMicroCredits(txFee as string);

    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const transactionMintAmount = getCreditsToMicroCredits(getCreditsToMint(amount, mintRate)) + "u64";

    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "deposit_public_as_signer",
      [transactionAmount, transactionMintAmount, address],
      txFeeMicro,
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
      getLeoWalletFormattedTxFee(txFee || aleoFees.unstake.native),
      false,
    );

    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const leoWalletLiquidUnstake = async ({
  amount = "0",
  wallet,
  address,
  chainId = "aleo",
  mintRate,
  instantWithdrawal,
}: T.LeoWalletUnstakeProps) => {
  try {
    const txFee = getLiquidFees({ amount, type: instantWithdrawal ? "instant_unstake" : "unstake" });
    const txFeeMicro = getCreditsToMicroCredits(txFee as string);

    const transactionMintAmount = getCreditsToMicroCredits(getCreditsToMint(amount, mintRate)) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      instantWithdrawal ? "instant_withdraw_public" : "withdraw_public",
      [transactionMintAmount],
      txFeeMicro,
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
      getLeoWalletFormattedTxFee(txFee || aleoFees.withdraw.native),
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
  amount = "0",
}: T.LeoWalletWithdrawProps) => {
  try {
    const txFee = getLiquidFees({ amount, type: "withdraw" });
    const txFeeMicro = getCreditsToMicroCredits(txFee as string);

    const transactionAmount = getCreditsToMicroCredits(amount as string) + "u64";
    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "claim_withdrawal_public",
      [address, transactionAmount],
      txFeeMicro,
      false,
    );
    return await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
