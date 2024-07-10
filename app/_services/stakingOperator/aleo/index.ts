import type * as T from "../types";
import { fetchData } from "@/app/_utils/fetch";

export const getAddressActivity = async ({
  apiUrl,
  address,
  offset,
  limit,
  filterKey,
}: T.AddressActivityPaginationParams & T.BaseParams) => {
  const filterQuery = !!filterKey ? `&filterBy=type&filterKey=${filterKey}` : "";

  // const res: T.AddressActivityResponse = await fetchData(
  //   `${apiUrl}address/${address}/activity?offset=${offset}&limit=${limit}${filterQuery}`,
  // );

  const res: T.AddressActivityResponse = {
    status: "OK",
    statusCode: 200,
    data: {
      entries: [
        {
          type: "unstake",
          amount: 200000,
          rewardRate: 0.10791362752160369,
          timestamp: 0,
          id: "C97DB86C69002781147F080D63620B318519566F1F2B7ACB4DC956570A9945A4",
          completionTime: 0,
          created_at: "2024-07-10T10:12:58.707027Z",
          txHash: "u2n4ikjn2i4",
          inProgress: true,
        },
        {
          type: "unstake",
          amount: 100000,
          rewardRate: 0.10791362752160369,
          timestamp: 1720606355,
          id: "688176E4FB1077B3F10B3E8E17136E1EDAD9562A248B3FCF9719986C8A39829C",
          completionTime: 1722420755,
          created_at: "2024-07-10T10:12:37.267466Z",
          inProgress: false,
          txHash: "u2n4ikjn2i4",
          result: "success",
        },
        {
          type: "withdraw",
          amount: 100000,
          rewardRate: 0.10791362752160369,
          timestamp: 1720606355,
          id: "688176E4FB1077B3F10B3E8E17136E1EDAD9562A248B3FCF9719986C8A39829C",
          completionTime: 1722420755,
          created_at: "2024-07-10T10:12:37.267466Z",
          inProgress: false,
          txHash: "u2n4ikjn2i4",
          result: "success",
        },
      ],
    },
    hasMore: false,
    totalEntries: 2,
    message: "Address history retrieved successfully.",
  };

  return res;
};

export const getServerStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.ServerStatusResponse = await fetchData(`${apiUrl}status`);
  return res;
};

export const getAddressBalance = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AddressBalanceResponse = await fetchData(`${apiUrl}address/${address}/balance`);
  return res;
};

export const getAddressStakedBalance = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AddressStakedBalanceResponse = await fetchData(`${apiUrl}address/${address}/staked-balance`);
  return res;
};

export const getAddressDelegation = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.ValidatorDetailsResponse = await fetchData(`${apiUrl}address/${address}/delegation`);
  return res.response;
};

export const getValidatorDetails = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.ValidatorDetailsResponse = await fetchData(`${apiUrl}network/validator/${address}`);
  return res.response;
};

export const getOperatorValidator = async ({
  apiUrl,
  address,
  amount,
  stakingOption,
}: { amount: string; stakingOption: T.DelegateStakingOption } & T.BaseParams) => {
  const res: T.OperatorDelegateResponse = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount, stakingOption }),
  });
  return {
    validatorAddress: res.validator,
    uuid: res.uuid,
  };
};

export const setMonitorTx = async ({ apiUrl, txHash, uuid }: { apiUrl: string; txHash: string; uuid: string }) => {
  const res = await fetchData(`${apiUrl}monitor/hash/${uuid}/${txHash}`, {
    method: "PUT",
  });
  return res;
};

export const getNetworkStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkStatusResponse = await fetchData(`${apiUrl}network/status`);
  return res;
};

export const getNetworkReward = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkRewardResponse = await fetchData(`${apiUrl}network/reward`);
  return res;
};
