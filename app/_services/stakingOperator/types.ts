export type AuthCheckResponse = {
  granted: boolean;
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

export type CosmosBankMsgSend = {
  "@type": "/cosmos.bank.v1beta1.MsgSend";
  from_address: string;
  to_address: string;
  amount: Array<{
    denom: string;
    amount: string;
  }>;
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
    pagination: {
      total: number;
    };
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
export type AddressActivityPaginationParams = PaginationParams & {
  filterKey: "stake" | "unstake" | null;
};
export type ActivityItem = {
  type: "stake" | "unstake";
  amount: number;
  rewardRate: number;
  timestamp: number;
  txHash: string;
  inProgress?: boolean;
};

export type AddressRewardsHistoryResponse = CommonEntriesResponse<
  AddressRewardsHistoryPaginationParams & { address: string },
  RewardsHistoryItem
> & {
  hasMore?: boolean | null;
  totalEntries?: number | null;
};
export type AddressRewardsHistoryPaginationParams = PaginationParams;

export type RewardsHistoryItem = {
  type: "compound";
  amount: number;
  rewardRate: number;
  timestamp: number;
  txHash: string;
  inProgress?: boolean;
};

export type PaginationParams = {
  offset: number;
  limit: number;
};
type CommonResponse<R, D> = {
  status: "OK" | "Bad Request" | "Internal Server Error";
  statusCode: number;
  requestBody?: R;
  data: D | null;
  message?: string;
};
type CommonEntriesResponse<R, D> = Omit<CommonResponse<R, D>, "data"> & {
  data?: Array<D> | null;
};

export type NetworkReward = number;
