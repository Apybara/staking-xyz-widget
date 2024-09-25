import type * as T from "../types";
import type { StakingType } from "@/app/types";
import type { TxProcedureType } from "../../txProcedure/types";
import { getCreditsToMicroCredits } from "../../aleo/utils";
import { fetchData } from "@/app/_utils/fetch";

export const getAddressRewards = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AleoAddressRewardsResponse = await fetchData(`${apiUrl}address/${address}/rewards`);
  return res;
};

export const getAddressActivity = async ({
  apiUrl,
  address,
  offset,
  limit,
  filterKey,
}: T.AleoAddressActivityPaginationParams & T.BaseParams) => {
  const filterQuery = !!filterKey ? `&filterBy=type&filterKey=${filterKey}` : "";

  const res: T.AddressActivityResponse = await fetchData(
    `${apiUrl}address/${address}/activity?offset=${offset}&limit=${limit}${filterQuery}`,
  );

  return res;
};

export const getServerStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.ServerStatusResponse = await fetchData(`${apiUrl}status`);
  return res;
};

export const getAddressHistoricalStakingAmount = async ({ apiUrl, address }: T.BaseParams) => {
  const res: T.AddressHistoricalStakingAmountResponse = await fetchData(
    `${apiUrl}address/${address}/historical-staking-amount`,
  );
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

export const getOperatorResponseQuery = ({ type }: { type: TxProcedureType }) => {
  if (type === "claim") return getOperatorUUID;
  return getOperatorValidator;
};

export const getOperatorValidator = async ({
  apiUrl,
  address,
  amount,
  stakingOption,
}: { amount: string; stakingOption: T.DelegateStakingOption } & T.BaseParams) => {
  const formattedAmount = getCreditsToMicroCredits(amount).toString();
  const res: T.OperatorValidatorResponse = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount: formattedAmount, stakingOption }),
  });
  return {
    validatorAddress: res.validator,
    uuid: res.uuid,
    txFee: res.estimatedTxFee,
  };
};

export const getOperatorUUID = async ({
  apiUrl,
  address,
  stakingOption,
}: { stakingOption: T.DelegateStakingOption } & T.BaseParams) => {
  const res: T.OperatorUUIDResponse = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, stakingOption }),
  });
  return {
    validatorAddress: null,
    uuid: res.uuid,
    txFee: res.estimatedTxFee,
  };
};

export const getNetworkStatus = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkStatusResponse = await fetchData(`${apiUrl}network/status`);
  return res;
};

export const getNetworkReward = async ({ apiUrl }: Omit<T.BaseParams, "address">) => {
  const res: T.NetworkRewardResponse = await fetchData(`${apiUrl}network/reward`);
  return res;
};

export const setMonitorTxByAddress = async ({
  apiUrl,
  address,
  type,
  stakingType,
  amount,
}: {
  apiUrl: string;
  address: string;
  type: TxProcedureType;
  stakingType: StakingType;
  amount: number;
}) => {
  const res = await fetchData(`${apiUrl}monitor/hash/${address}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: monitorByAddressTypeMap[stakingType][type],
      amount,
      staking_option: stakingType,
      protocol: protocolMap[stakingType],
    }),
  });
  return res;
};

export const setCoinbaseUserTracking = async ({
  apiUrl,
  address,
  transactionId,
  userId,
}: T.BaseParams & {
  transactionId: string;
  userId: string;
}) => {
  await fetchData(`${apiUrl}stake/user/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "stake",
      address,
      transactionId,
      userId,
    }),
  });
};

const monitorByAddressTypeMap: Record<StakingType, Record<TxProcedureType, string>> = {
  native: {
    claim: "claim",
    delegate: "stake",
    undelegate: "unstake",
    instant_undelegate: "",
    redelegate: "",
  },
  liquid: {
    claim: "claim_withdrawal_public",
    delegate: "deposit_public_as_signer",
    undelegate: "withdraw_public",
    instant_undelegate: "instant_withdraw_public",
    redelegate: "",
  },
};

const protocolMap: Record<StakingType, string> = {
  native: "",
  liquid: "pondo_v1",
};
