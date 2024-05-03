import { fetchData } from "@/app/_utils/fetch";
import type * as T from "../types";

export const getAddressAuthCheck = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AuthCheckResponse = await fetchData(`${apiUrl}address/check/${address}`);
  return res;
};

export const getAddressActivity = ({
  apiUrl,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & T.BaseParams) => {
  if (filterKey === "stake") {
    return {
      status: "OK",
      statusCode: 200,
      totalEntries: 100,
      data: {
        entries: new Array(limit).fill({
          type: "stake",
          amount: Math.floor(Math.random() * 100),
          rewardRate: Math.random() * 0.1,
          timestamp: 733018042,
          txHash: Math.random().toString(36).substring(7),
        }),
      },
    } as T.AddressActivityResponse;
  }
  if (filterKey === "unstake") {
    return {
      status: "OK",
      statusCode: 200,
      totalEntries: 100,
      data: {
        entries: new Array(limit).fill({
          type: "unstake",
          amount: Math.floor(Math.random() * 100),
          rewardRate: Math.random() * 0.1,
          timestamp: 733018042,
          txHash: Math.random().toString(36).substring(7),
        }),
      },
    } as T.AddressActivityResponse;
  }
  return {
    status: "OK",
    statusCode: 200,
    totalEntries: 100,
    data: {
      entries: new Array(limit).fill(0).map(() => ({
        type: ["stake", "unstake"][Math.floor(Math.random() * 2)],
        amount: Math.floor(Math.random() * 100),
        rewardRate: Math.random() * 0.1,
        timestamp: 733018042,
        txHash: Math.random().toString(36).substring(7),
        inProgress: Math.random() > 0.7,
      })),
    },
  } as T.AddressActivityResponse;
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
