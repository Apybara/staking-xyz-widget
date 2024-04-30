import { fetchData } from "@/app/_utils/fetch";
import type * as T from "../types";

const API_URL = process.env.NEXT_PUBLIC_STAKING_API_CELESTIA;

export const getAddressAuthCheck = async (address: string) => {
  const res: T.AuthCheckResponse = await fetchData(`${API_URL}address/check/${address}`);
  return res;
};

export const getAddressActivity = ({
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & { address: string }) => {
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

export const getAddressRewards = async ({ address }: { address: string }) => {
  const res: T.AddressRewardsResponse = await fetchData(`${API_URL}address/${address}/rewards`);

  return res;
};

export const getAddressRewardsHistory = async ({
  address,
  offset,
  limit,
}: T.AddressRewardsHistoryPaginationParams & { address: string }) => {
  const res: T.AddressRewardsHistoryResponse = await fetchData(
    `${API_URL}address/${address}/rewards/activity?offset=${offset}&limit=${limit}`,
  );

  return res;
};

export const getDelegateMessage = async (address: string, amount: number) => {
  const res: T.DelegateMessageResponse = await fetchData(`${API_URL}stake/user/delegate`, {
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

export const setMonitorTx = async ({ txHash, uuid }: { txHash: string; uuid: string }) => {
  const res = await fetchData(`${API_URL}monitor/hash/${uuid}/${txHash}`, {
    method: "PUT",
  });
  return res;
};

export const setMonitorGrantTx = async ({ txHash }: { txHash: string }) => {
  const res = await fetchData(`${API_URL}monitor/grant/${txHash}`, {
    method: "PUT",
  });
  return res;
};

export const getDelegateValidatorMessages = (operatorMessage: T.DecodedDelegateMessageResponse) => {
  return operatorMessage.body.messages
    .filter((msg) => msg["@type"] === "/cosmos.staking.v1beta1.MsgDelegate")
    .map((msg: T.CosmosStakingMsgDelegate) => ({ validator: msg.validator_address, amount: msg.amount }));
};

export const getUndelegateMessage = async (address: string, amount: number) => {
  const res: T.UndelegateMessageResponse = await fetchData(`${API_URL}stake/user/undelegate`, {
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

export const getUnbondingDelegations = async (address: string) => {
  const res: T.UnbondingDelegationsResponse = await fetchData(`${API_URL}address/fetch/undelegate/${address}`);
  return res.response.unbonding_responses;
};

export const getDelegations = async (address: string) => {
  const res: T.DelegationsResponse = await fetchData(`${API_URL}address/fetch/delegate/${address}`);
  return res.response.delegation_responses;
};

export const getNetworkReward = async () => {
  const res: T.NetworkRewardResponse = await fetchData(`${API_URL}network/reward`);
  return res;
};
