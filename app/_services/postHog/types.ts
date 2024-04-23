import type { WalletType } from "../../types";
import { EventVariants } from "./consts";

export type Event = (typeof EventVariants)[number];

export type EventFunctionTypes = {
  wallet_connect_succeeded: ({ wallet, address }: WalletConnectivityProps) => void;
  wallet_connect_failed: ({ wallet, address }: WalletConnectivityProps) => void;
  wallet_disconnect_succeeded: ({ wallet, address }: WalletConnectivityProps) => void;
  stake_tx_flow_started: ({ amount, hasAuthApproval }: StakeTxFlowStartProps) => void;
  stake_tx_flow_auth_succeeded: () => void;
  stake_tx_flow_auth_failed: () => void;
  stake_tx_flow_delegate_succeeded: () => void;
  stake_tx_flow_delegate_failed: () => void;
  unstake_tx_flow_started: ({ amount }: UnstakeTxFlowStartProps) => void;
  unstake_tx_flow_undelegate_succeeded: () => void;
  unstake_tx_flow_undelegate_failed: () => void;
};

export type WalletConnectivityProps = {
  wallet: WalletType;
  address: string;
};

export type StakeTxFlowStartProps = {
  amount: string;
  hasAuthApproval?: boolean;
};

export type UnstakeTxFlowStartProps = {
  amount: string;
};
