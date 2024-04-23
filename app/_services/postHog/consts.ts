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
] as const;

export const eventVariants = [...EventVariants];
