import type * as T from "./types";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import BigNumber from "bignumber.js";
import { PALEO_INSTANT_WITHDRAWAL_FEE_RATIO } from "@/app/consts";
import { requestCreateEvent, getEvent, EventType, EventStatus } from "@puzzlehq/sdk";
import { aleoNetworkIdByWallet } from "../consts";
import { getCreditsToMicroCredits, getCreditsToMint, getMicroCreditsToCredits, getMintToCredits } from "../utils";
import { aleoFees } from "@/app/consts";
import { getLiquidFees } from "@/app/_utils/transaction";

export const getPuzzleTxStatus = async ({
  id,
  address,
  chainId = "aleo",
}: T.PuzzleTxStatusProps): Promise<AleoTxStatusResponse> => {
  try {
    const res = await getEvent({ id, address, network: aleoNetworkIdByWallet[chainId].puzzle });
    return {
      status: getPuzzleFormattedStatus({ status: res.event?.status }),
      txId: res.event?.transactionId,
    };
  } catch (error) {
    return {
      status: "error",
      txId: undefined,
    };
  }
};
const getPuzzleFormattedStatus = ({ status }: { status?: EventStatus }): AleoTxStatus => {
  if (status === "Creating" || status === "Pending") return "loading";
  if (status === "Settled") return "success";

  // Failed tx
  return "error";
};

export const puzzleStake = async ({
  amount,
  validatorAddress,
  address,
  chainId = "aleo",
  txFee,
}: T.PuzzleStakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "bond_public",
        fee: getMicroCreditsToCredits(txFee || aleoFees.stake.native),
        inputs: [validatorAddress, address, transactionAmount],
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from bond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidStake = async ({ amount, address, chainId = "aleo", mintRate }: T.PuzzleStakeProps) => {
  const txFee = getLiquidFees({ amount, type: "stake" });

  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
  const transactionMintAmount = getCreditsToMicroCredits(getCreditsToMint(amount, mintRate)) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "pondo_core_protocolv1.aleo",
        functionId: "deposit_public_as_signer",
        fee: txFee || 0,
        inputs: [transactionAmount, transactionMintAmount, address],
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from deposit_public_as_signer requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleUnstake = async ({ address, amount, chainId = "aleo", txFee }: T.PuzzleUnstakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "unbond_public",
        fee: getMicroCreditsToCredits(txFee || aleoFees.unstake.native),
        inputs: [address, transactionAmount],
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from unbond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidUnstake = async ({
  address,
  amount,
  chainId = "aleo",
  mintRate,
  instantWithdrawal,
}: T.PuzzleUnstakeProps) => {
  const txFee = getLiquidFees({ amount, type: instantWithdrawal ? "instant_unstake" : "unstake" });

  const txPAleoAmount = getCreditsToMicroCredits(amount) + "u64";
  const txAleoAmount = getCreditsToMicroCredits(getMintToCredits(amount, mintRate)) + "u64";
  const inputs = instantWithdrawal ? [txPAleoAmount, txAleoAmount] : [txPAleoAmount];

  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "pondo_core_protocolv1.aleo",
        functionId: instantWithdrawal ? "instant_withdraw_public" : "withdraw_public",
        fee: txFee || 0,
        inputs,
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from withdraw_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleWithdraw = async ({ address, chainId = "aleo", txFee }: T.PuzzleWithdrawProps) => {
  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "claim_unbond_public",
        fee: getMicroCreditsToCredits(txFee || aleoFees.withdraw.native),
        inputs: [address],
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from claim_unbond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidWithdraw = async ({ address, chainId = "aleo", amount = "0" }: T.PuzzleWithdrawProps) => {
  const txFee = getLiquidFees({ amount, type: "withdraw" });
  const transactionAmount = getCreditsToMicroCredits(amount as string) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "pondo_core_protocolv1.aleo",
        functionId: "claim_withdrawal_public",
        fee: txFee || 0,
        inputs: [address, transactionAmount],
      },
      aleoNetworkIdByWallet[chainId].puzzle,
    );

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from claim_withdrawal_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
