import { fetchData } from "@/app/_utils/fetch";
import type * as T from "../types";

export const getAddressAuthCheck = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AuthCheckResponse = await fetchData(`${apiUrl}address/check/${address}`);
  return res;
};

export const getAddressActivity = async ({
  apiUrl,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & T.BaseParams) => {
  const filterQuery = !!filterKey ? `&filterBy=type&filterKey=${filterKey}` : "";

  const res: T.AddressActivityResponse = await fetchData(
    `${apiUrl}address/${address}/activity?offset=${offset}&limit=${limit}${filterQuery}`,
  );

  return res;
};

export const getAddressRewards = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AddressRewardsResponse = await fetchData(`${apiUrl}address/${address}/rewards`);

  return res;
};

export const getAddressRewardsHistory = async ({
  apiUrl,
  address,
  offset,
  limit,
}: T.AddressRewardsHistoryPaginationParams & T.BaseParams) => {
  const res: T.AddressRewardsHistoryResponse = await fetchData(
    `${apiUrl}address/${address}/rewards/activity?offset=${offset}&limit=${limit}`,
  );

  return res;
};

export const getDelegateMessage = async ({ apiUrl, address, amount }: { amount: number } & T.BaseParams) => {
  const res: T.DelegateMessageResponse = await fetchData(`${apiUrl}stake/user/delegate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount }),
  });
  return {
    unsignedMessage: JSON.parse(atob(res.unsigned_txn)) as T.DecodedDelegateMessageResponse,
    uuid: res.uuid,
  };
};

export const setMonitorTx = async ({ apiUrl, txHash, uuid }: { apiUrl: string; txHash: string; uuid: string }) => {
  const res = await fetchData(`${apiUrl}monitor/hash/${uuid}/${txHash}`, {
    method: "PUT",
  });
  return res;
};

export const setMonitorGrantTx = async ({ apiUrl, txHash }: { apiUrl: string; txHash: string }) => {
  const res = await fetchData(`${apiUrl}monitor/grant/${txHash}`, {
    method: "PUT",
  });
  return res;
};

export const getDelegateValidatorMessages = (operatorMessage: T.DecodedDelegateMessageResponse) => {
  return operatorMessage.body.messages
    .filter((msg) => msg["@type"] === "/cosmos.staking.v1beta1.MsgDelegate")
    .map((msg: T.CosmosStakingMsgDelegate) => ({ validator: msg.validator_address, amount: msg.amount }));
};

export const getUndelegateMessage = async ({ apiUrl, address, amount }: { amount: number } & T.BaseParams) => {
  const res: T.UndelegateMessageResponse = await fetchData(`${apiUrl}stake/user/undelegate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount }),
  });
  return {
    unsignedMessage: JSON.parse(atob(res.unsigned_txn)) as T.DecodedUndelegateMessageResponse,
    uuid: res.uuid,
  };
};

export const getUndelegateValidatorMessages = (operatorMessage: T.DecodedUndelegateMessageResponse) => {
  return operatorMessage.body.messages
    .filter((msg) => msg["@type"] === "/cosmos.staking.v1beta1.MsgUndelegate")
    .map((msg: T.CosmosStakingMsgUndelegate) => ({ validator: msg.validator_address, amount: msg.amount }));
};

export const getUnbondingDelegations = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.UnbondingDelegationsResponse = await fetchData(`${apiUrl}address/fetch/undelegate/${address}`);
  return res.response.unbonding_responses;
};

export const getDelegations = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.DelegationsResponse = await fetchData(`${apiUrl}address/fetch/delegate/${address}`);
  return res.response.delegation_responses;
};

export const getNetworkReward = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkRewardResponse = await fetchData(`${apiUrl}network/reward`);
  return res;
};

export const getNetworkStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkStatusResponse = await fetchData(`${apiUrl}network/status`);
  return res;
};

export const getServerStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.ServerStatusResponse = await fetchData(`${apiUrl}status`);
  return res;
}
export const getRedelegateMessage = async ({ apiUrl, address, amount }: { amount: number } & T.BaseParams) => {
  const res: T.RedelegateMessageResponse = await fetchData(`${apiUrl}stake/user/redelegate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount }),
  });
  return {
    unsignedMessage: JSON.parse(atob(res.unsigned_txn)) as T.DecodedRedelegateMessageResponse,
    uuid: res.uuid,
  };
};

export const getRedelegateValidatorMessages = (operatorMessage: T.DecodedRedelegateMessageResponse) => {
  return operatorMessage.body.messages
    .filter((msg) => msg["@type"] === "/cosmos.staking.v1beta1.MsgRedelegate")
    .map((msg: T.CosmosStakingMsgRedelegate) => ({ validator: msg.validator_address, amount: msg.amount }));
};
