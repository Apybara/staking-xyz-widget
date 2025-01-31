import type * as T from "./types";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import { requestCreateEvent, getEvent, EventType, EventStatus } from "@puzzlehq/sdk";
import { isAleoTestnet } from "@/app/consts";
import { aleoNetworkIdByWallet } from "../consts";
import {
  getCreditsToMicroCredits,
  getMicroCreditsToCredits,
  getInstantWithdrawalAleoAmount,
  getPAleoDepositMintingAmountFromAleo,
} from "../utils";
import { aleoFees } from "@/app/consts";

const defaultChainId = isAleoTestnet ? "testnet" : "mainnet";

export const getPuzzleTxStatus = async ({
  id,
  address,
  chainId = defaultChainId,
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
  chainId = defaultChainId,
  txFee,
}: T.PuzzleStakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId: "credits.aleo",
      functionId: "bond_public",
      fee: getMicroCreditsToCredits(txFee || aleoFees.stake.native),
      inputs: [validatorAddress, address, transactionAmount],
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from bond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidStake = async ({
  amount,
  address,
  chainId = defaultChainId,
  aleoToPAleoRate,
}: T.PuzzleStakeProps) => {
  const txFee = getMicroCreditsToCredits(aleoFees.stake.liquid);
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
  const transactionMintAmount = getPAleoDepositMintingAmountFromAleo({
    aleoCredits: amount,
    aleoToPAleoRate,
  }).txMicroCreditsInput;

  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId:
        (isAleoTestnet
          ? process.env.NEXT_PUBLIC_ALEOTESTNET_PONDO_CORE_ID
          : process.env.NEXT_PUBLIC_ALEO_PONDO_CORE_ID) || "pondo_protocol.aleo",
      functionId: "deposit_public_as_signer",
      fee: txFee || 0,
      inputs: [transactionAmount, transactionMintAmount, address],
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from deposit_public_as_signer requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleUnstake = async ({ address, amount, chainId = defaultChainId, txFee }: T.PuzzleUnstakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId: "credits.aleo",
      functionId: "unbond_public",
      fee: getMicroCreditsToCredits(txFee || aleoFees.unstake.native),
      inputs: [address, transactionAmount],
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from unbond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidUnstake = async ({
  amount,
  chainId = defaultChainId,
  pAleoToAleoRate,
  instantWithdrawal,
}: T.PuzzleUnstakeProps) => {
  const txFee = getMicroCreditsToCredits(aleoFees[instantWithdrawal ? "instant_unstake" : "unstake"].liquid);
  const pAleoMicroCredits = getCreditsToMicroCredits(amount);
  const txPAleoAmount = pAleoMicroCredits + "u64";
  const txAleoAmount = getInstantWithdrawalAleoAmount({ pAleoMicroCredits, pAleoToAleoRate });
  const inputs = instantWithdrawal ? [txPAleoAmount, txAleoAmount] : [txPAleoAmount];

  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId:
        (isAleoTestnet
          ? process.env.NEXT_PUBLIC_ALEOTESTNET_PONDO_CORE_ID
          : process.env.NEXT_PUBLIC_ALEO_PONDO_CORE_ID) || "pondo_protocol.aleo",
      functionId: instantWithdrawal ? "instant_withdraw_public" : "withdraw_public",
      fee: txFee || 0,
      inputs,
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from withdraw_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleWithdraw = async ({ address, chainId = defaultChainId, txFee }: T.PuzzleWithdrawProps) => {
  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId: "credits.aleo",
      functionId: "claim_unbond_public",
      fee: getMicroCreditsToCredits(txFee || aleoFees.withdraw.native),
      inputs: [address],
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from claim_unbond_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const puzzleLiquidWithdraw = async ({
  address,
  chainId = defaultChainId,
  amount = "0",
}: T.PuzzleWithdrawProps) => {
  const txFee = getMicroCreditsToCredits(aleoFees.withdraw.liquid);
  const transactionAmount = getCreditsToMicroCredits(amount as string) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent({
      type: EventType.Execute,
      programId:
        (isAleoTestnet
          ? process.env.NEXT_PUBLIC_ALEOTESTNET_PONDO_CORE_ID
          : process.env.NEXT_PUBLIC_ALEO_PONDO_CORE_ID) || "pondo_protocol.aleo",
      functionId: "claim_withdrawal_public",
      fee: txFee || 0,
      inputs: [address, transactionAmount],
      network: aleoNetworkIdByWallet[chainId].puzzle,
    });

    if (error) throw new Error(error);
    if (!eventId) throw new Error("No eventId returned from claim_withdrawal_public requestCreateEvent");
    return eventId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
