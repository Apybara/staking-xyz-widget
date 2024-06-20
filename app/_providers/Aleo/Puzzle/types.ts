import type { Dispatch, Reducer, ReactNode } from "react";
import type { WalletStates } from "@/app/_contexts/WalletContext/types";

export type PuzzleStatesContext = PuzzleStatesContextStates & {};

export type PuzzleStatesContextStates = {
  connectionStatus: WalletStates["connectionStatus"];
  setStates: Dispatch<Partial<PuzzleStatesContextStates>>;
};

export type PuzzleStatesProviderProps = {
  children: ReactNode;
};

export type UsePuzzleStatesReducer = Reducer<PuzzleStatesContextStates, Partial<PuzzleStatesContextStates>>;
