import type { GetEventRequest } from "@puzzlehq/sdk";
import type { AleoStakeProps, AleoUnstakeProps, AleoWithdrawProps } from "../types";

export type PuzzleTxStatusProps = Omit<GetEventRequest, "network"> & {
  chainId?: AleoStakeProps["chainId"];
};

export type PuzzleStakeProps = AleoStakeProps;

export type PuzzleUnstakeProps = Omit<AleoUnstakeProps, "address">;

export type PuzzleWithdrawProps = Omit<AleoWithdrawProps, "address">;
