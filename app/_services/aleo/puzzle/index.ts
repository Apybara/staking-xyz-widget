import type * as T from "./types";
import type { AleoTxStatus, AleoTxStatusResponse } from "../types";
import { requestCreateEvent, getEvent, EventType, EventStatus } from "@puzzlehq/sdk";
import { aleoNetworkIdByWallet } from "../consts";
import { getCreditsToMicroCredits } from "../utils";

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

export const puzzleStake = async ({ amount, validatorAddress, address, chainId = "aleo" }: T.PuzzleStakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";
  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "bond_public",
        fee: 0.84388,
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

export const puzzleUnstake = async ({ amount, chainId = "aleo" }: T.PuzzleUnstakeProps) => {
  const transactionAmount = getCreditsToMicroCredits(amount) + "u64";

  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "unbond_public",
        fee: 1.233777,
        inputs: [transactionAmount],
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

export const puzzleWithdraw = async ({ chainId = "aleo" }: T.PuzzleWithdrawProps) => {
  try {
    const { eventId, error } = await requestCreateEvent(
      {
        type: EventType.Execute,
        programId: "credits.aleo",
        functionId: "claim_unbond_public",
        fee: 0.16723,
        inputs: [],
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
