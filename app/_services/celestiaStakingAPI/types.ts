export type AuthCheckResponse = {
  granted: boolean;
};

export type DelegateMessageResponse = {
  unsigned_txn: string;
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

export type CosmosStakingMsgDelegate = {
  "@type": "/cosmos.staking.v1beta1.MsgDelegate";
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
