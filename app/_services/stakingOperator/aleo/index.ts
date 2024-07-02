import type * as T from "../types";
import { fetchData } from "@/app/_utils/fetch";

export const getServerStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.ServerStatusResponse = await fetchData(`${apiUrl}status`);
  return res;
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
