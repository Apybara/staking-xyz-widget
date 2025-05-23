import type { StakingType } from "@/app/types";

export type BaseParams = {
  address: string;
  apiUrl: string;
};

export type AuthCheckResponse = {
  granted: boolean;
  txnHash?: string;
};

export type OperatorMessageResponse = {
  unsigned_txn: string;
  uuid: string;
};

export type OperatorValidatorResponse = {
  validator: string;
  uuid: string;
  estimatedTxFee: string;
};
export type OperatorUUIDResponse = {
  uuid: string;
  estimatedTxFee: string;
};

export type DelegateStakingOption = StakingType;

export type DecodedOperatorMessageResponse = {
  body: {
    messages: Array<CosmosStakingMsg | CosmosStakingMsg>;
    memo?: string;
    timeout_height?: string;
    extension_options?: any[];
    non_critical_extension_options?: any[];
  };
  auth_info?: {
    signer_infos: any[];
    fee: {
      amount: any[];
      gas_limit: string;
      payer: string;
      granter: string;
    };
    tip: null;
  };
  signatures?: any[];
};

export type DelegateMessageResponse = {
  unsigned_txn: string;
  uuid: string;
};

export type DecodedDelegateMessageResponse = {
  body: {
    messages: Array<CosmosStakingMsgDelegate | CosmosStakingMsgDelegate>;
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
  };
  auth_info: {
    signer_infos: any[];
    fee: {
      amount: any[];
      gas_limit: string;
      payer: string;
      granter: string;
    };
    tip: null;
  };
  signatures: any[];
};

export type UndelegateMessageResponse = {
  unsigned_txn: string;
  uuid: string;
};

export type DecodedUndelegateMessageResponse = {
  body: {
    messages: Array<CosmosStakingMsgUndelegate>;
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
  };
  auth_info: {
    signer_infos: any[];
    fee: {
      amount: any[];
      gas_limit: string;
      payer: string;
      granter: string;
    };
    tip: null;
  };
  signatures: any[];
};

export type WithdrawRewardsMessageResponse = {
  unsigned_txn: string;
  uuid: string;
};

export type DecodedWithdrawRewardsMessageResponse = {
  body: {
    messages: Array<CosmosDistributionMsgWithdrawDelegatorReward>;
  };
};

export type RedelegateMessageResponse = {
  unsigned_txn: string;
  uuid: string;
};

export type DecodedRedelegateMessageResponse = {
  body: {
    messages: Array<CosmosStakingMsgBeginRedelegate | CosmosStakingMsgBeginRedelegate>;
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
  };
  auth_info: {
    signer_infos: any[];
    fee: {
      amount: any[];
      gas_limit: string;
      payer: string;
      granter: string;
    };
    tip: null;
  };
  signatures: any[];
};

export type CosmosStakingMsgType =
  | "/cosmos.staking.v1beta1.MsgDelegate"
  | "/cosmos.staking.v1beta1.MsgUndelegate"
  | "/cosmos.staking.v1beta1.MsgBeginRedelegate"
  | "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";

export type CosmosStakingMsg = {
  "@type": CosmosStakingMsgType;
  delegator_address: string;
  validator_address?: string;
  validator_src_address?: string;
  validator_dst_address?: string;
  amount: {
    denom: string;
    amount: string;
  };
};

export type CosmosStakingMsgDelegate = {
  "@type": "/cosmos.staking.v1beta1.MsgDelegate";
  delegator_address: string;
  validator_address: string;
  amount: {
    denom: string;
    amount: string;
  };
};

export type CosmosStakingMsgUndelegate = {
  "@type": "/cosmos.staking.v1beta1.MsgUndelegate";
  delegator_address: string;
  validator_address: string;
  amount: {
    denom: string;
    amount: string;
  };
};

export type CosmosDistributionMsgWithdrawDelegatorReward = {
  "@type": "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
  delegator_address: string;
  validator_address: string;
};

export type CosmosStakingMsgBeginRedelegate = {
  "@type": "/cosmos.staking.v1beta1.MsgBeginRedelegate";
  delegator_address: string;
  validator_src_address: string;
  validator_dst_address: string;
  amount: {
    denom: string;
    amount: string;
  };
};

export type CosmosBankMsgSend = {
  "@type": "/cosmos.bank.v1beta1.MsgSend";
  from_address: string;
  to_address: string;
  amount: Array<{
    denom: string;
    amount: string;
  }>;
};

export type UnbondingDelegation = {
  validatorAddress: string;
  remainingTime?: {
    d: number | undefined;
    h: number | undefined;
    m: number | undefined;
    s: number | undefined;
  };
  amount: string;
};

export type UnbondingDelegationsResponse = {
  granter: string;
  message: string;
  response: {
    unbonding_responses: Array<UnbondingDelegationResponseItem>;
    pagination: {
      total: number;
    };
  };
};

export type UnbondingDelegationResponseItem = {
  delegator_address: string;
  validator_address: string;
  entries: Array<{
    creation_height: string;
    completion_time: string;
    initial_balance: string;
    balance: string;
  }>;
};

export type DelegationsResponse = {
  granter: string;
  message: string;
  response: {
    delegation_responses: Array<DelegationResponseItem>;
  };
  total: number;
};

export type ExternalDelegationsResponse = {
  address: string;
  list: Array<string>;
  message: string;
  response: {
    total: number;
    reward_rate: number;
    unbonding_time: string;
  };
};

export type DelegationResponseItem = {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
};

export type AddressActivityResponse = CommonEntriesResponse<
  AddressActivityPaginationParams & { address: string },
  ActivityItem
> & {
  hasMore?: boolean | null;
  totalEntries?: number | null;
};
export type AddressActivityPaginationParams =
  | StandardAddressActivityPaginationParams
  | AleoAddressActivityPaginationParams;

export type StandardAddressActivityPaginationParams = {
  tsType: "standard";
  filterKey?:
    | "stake"
    | "unstake"
    | "redelegate"
    | "transactions"
    | "transactions_stake"
    | "transactions_unstake"
    | "transactions_rewards"
    | "transactions_redelegate"
    | null;
} & PaginationParams;

export type AleoAddressActivityPaginationParams = {
  tsType: "aleo";
  filterKey?:
    | "stake"
    | "unstake"
    | "claim"
    | "native_stake"
    | "native_unstake"
    | "native_claim"
    | "liquid_stake"
    | "liquid_unstake"
    | "liquid_claim"
    | null;
} & PaginationParams;

export type ActivityItem = {
  id: string;
  type: "stake" | "unstake" | "rewards" | "redelegate" | "claim";
  amount: number;
  rewardRate: number;
  timestamp: number;
  created_at: string;
  completionTime?: number;
  txHash: string;
  inProgress?: boolean;
  status: string;
  result?: "success" | "failed";
  staking_option?: "native" | "liquid";
};

export type AddressRewardsResponse = CommonResponse<
  { address: string },
  {
    total_rewards: number;
    last_cycle_rewards: number;
    daily_rewards: number;
    accrued_rewards: number;
  }
>;

export type AleoAddressRewardsResponse = {
  cumulativeRewards: number;
  lastIndexed: number;
};

export type AddressRewardsHistoryResponse = CommonEntriesResponse<
  AddressRewardsHistoryPaginationParams & { address: string },
  RewardsHistoryItem
> & {
  hasMore?: boolean | null;
  totalEntries?: number | null;
};
export type AddressRewardsHistoryPaginationParams = PaginationParams & {
  filterKey?: "transactions_rewards_daily" | "transactions_rewards_hourly" | "transactions_rewards" | null;
};

export type RewardsHistoryItem = {
  type: "rewards";
  id: string;
  amount: number;
  rewardRate: number;
  timestamp: number;
  created_at: string;
  txHash: string;
  inProgress?: boolean;
};

export type AddressBalanceResponse = {
  balance?: number;
};

export type AddressStakedBalanceResponse = {
  "total-staked"?: number;
};

export type AddressHistoricalStakingAmountResponse = {
  historicalAmount: {
    aleo: {
      stake: number;
      unstake: number;
    };
    pondo_v1: {
      stake: number;
      unstake: number;
    };
  };
};

export type PaginationParams = {
  offset: number;
  limit: number;
};
type CommonResponse<R, D> = {
  status: string;
  statusCode: number;
  requestBody?: R;
  data: D | null;
  message?: string;
};
type CommonEntriesResponse<R, D> = Omit<CommonResponse<R, D>, "data"> & {
  data?: { entries?: Array<D> } | null;
};

export type NetworkRewardResponse = number;
export type NetworkStatusResponse = {
  blockHeight: number;
  blockTime: string;
  networkOffline: boolean;
};
export type ServerStatusResponse = Omit<CommonResponse<{}, {}>, "data">;

export type ValidatorDetailsResponse = {
  response: {
    commission?: number;
    isOpen?: boolean;
    logo?: string;
    name?: string;
    validatorAddress?: string;
    message?: string;
  };
};
