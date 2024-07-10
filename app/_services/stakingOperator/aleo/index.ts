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

  const res: T.AddressActivityResponse = await fetchData(
    `${apiUrl}address/${address}/activity?offset=${offset}&limit=${limit}${filterQuery}`,
  );

  return res;
};

export const getWithdrawableAmount = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.WithdrawableAmountResponse = await fetchData(`${apiUrl}address/${address}/withdrawable-amount`);

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
