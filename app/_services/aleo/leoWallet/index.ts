import type { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import type * as T from "./types";
import { Transaction } from "@demox-labs/aleo-wallet-adapter-base";
import { aleoNetworkIdByWallet } from "../consts";
import {
  getCreditsToMicroCredits,
  getInstantWithdrawalAleoAmount,
  getPAleoDepositMintingAmountFromAleo,
} from "../utils";
import { aleoFees } from "@/app/consts";

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
      Number(txFee || aleoFees.stake.native),
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
  aleoToPAleoRate,
}: T.LeoWalletStakeProps) => {
  try {
    const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
    const transactionMintAmount = getPAleoDepositMintingAmountFromAleo({
      aleoCredits: amount,
      aleoToPAleoRate,
    });

    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      "deposit_public_as_signer",
      [transactionAmount, transactionMintAmount, address],
      Number(aleoFees.stake.liquid),
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
      Number(txFee || aleoFees.unstake.native),
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
  pAleoToAleoRate,
  instantWithdrawal,
}: T.LeoWalletUnstakeProps) => {
  try {
    const txFeeMicro = Number(aleoFees[instantWithdrawal ? "instant_unstake" : "unstake"].liquid);
    const pAleoMicroCredits = getCreditsToMicroCredits(amount);
    const txPAleoAmount = pAleoMicroCredits + "u64";
    const txAleoAmount = getInstantWithdrawalAleoAmount({ pAleoMicroCredits, pAleoToAleoRate });
    const inputs = instantWithdrawal ? [txPAleoAmount, txAleoAmount] : [txPAleoAmount];

    const aleoTransaction = Transaction.createTransaction(
      address,
      aleoNetworkIdByWallet[chainId].leoWallet,
      "pondo_core_protocolv1.aleo",
      instantWithdrawal ? "instant_withdraw_public" : "withdraw_public",
      inputs,
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
      Number(txFee || aleoFees.withdraw.native),
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
    const txFeeMicro = Number(aleoFees.withdraw.liquid);
    const transactionAmount = getCreditsToMicroCredits(amount || "0") + "u64";

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
