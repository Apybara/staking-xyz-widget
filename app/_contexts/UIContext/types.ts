import type { ReactNode } from "react";

export const ActionTypeVariants = ["TOGGLE_DIALOG"] as const;
export type ActionTypeVariant = (typeof ActionTypeVariants)[number];

export const DialogTypeVariants = [
  "walletConnection",
  "walletAccount",
  "stakingProcedure",
  "unstakingProcedure",
  "redelegatingProcedure",
  "claimingProcedure",
  "importHelp",
  "sendingTransactions",
] as const;
export type DialogTypeVariant = (typeof DialogTypeVariants)[number];

export type DialogValueType = boolean;

export interface UIContextProps {
  dialogs: { [key in DialogTypeVariant]: DialogValueType };
  toggleDialog: (name: DialogTypeVariant, value: DialogValueType) => void;
}

export interface UIState {
  dialogs: UIContextProps["dialogs"];
}

export type UIAction = { type: "TOGGLE_DIALOG"; name: DialogTypeVariant; value: DialogValueType };

export type UIReducer = (state: UIState, action: UIAction) => UIState;

export interface UseDialogProps {
  open: DialogValueType;
  toggleOpen: (value: DialogValueType) => void;
}

export interface UIContextProviderProps {
  children: ReactNode;
}

export type UseDialog = (name: DialogTypeVariant) => UseDialogProps;
