export const EventVariants = [
  "wallet_connect_succeeded",
  "wallet_connect_failed",
  "wallet_disconnect_succeeded",
  "stake_tx_flow_started",
  "stake_tx_flow_auth_succeeded",
  "stake_tx_flow_auth_failed",
  "stake_tx_flow_delegate_succeeded",
  "stake_tx_flow_delegate_failed",
  "unstake_tx_flow_started",
  "unstake_tx_flow_undelegate_succeeded",
  "unstake_tx_flow_undelegate_failed",
  "redelegate_tx_flow_started",
  "redelegate_tx_flow_auth_succeeded",
  "redelegate_tx_flow_auth_failed",
  "redelegate_tx_flow_redelegate_succeeded",
  "redelegate_tx_flow_redelegate_failed",
  "claim_tx_flow_started",
  "claim_tx_flow_auth_succeeded",
  "claim_tx_flow_auth_failed",
  "claim_tx_flow_succeeded",
  "claim_tx_flow_failed",
] as const;

export const eventVariants = [...EventVariants];

export const eventActionMap = {
  stake: "_delegate",
  unstake: "_undelegate",
  redelegate: "_redelegate",
  claim: "",
} as const;
