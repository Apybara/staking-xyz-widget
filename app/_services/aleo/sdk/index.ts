import type { StakingType } from "@/app/types";
import BigNumber from "bignumber.js";
import { fetchData } from "@/app/_utils/fetch";
import { getTimeDiffInSingleUnits } from "@/app/_utils/time";
import { getFormattedAleoString } from "./utils";

export const getAleoWalletBalanceByAddress = async ({ apiUrl, address }: { apiUrl: string; address: string }) => {
  const res = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMappingValue",
      params: {
        program_id: "credits.aleo",
        mapping_name: "account",
        key: address,
      },
    }),
  });

  if (!res?.result) {
    return "0";
  }

  return res.result.replace(/u64/g, "");
};

export const getAleoNativeStakedBalanceByAddress = async ({ apiUrl, address }: { apiUrl: string; address: string }) => {
  const res = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMappingValue",
      params: {
        program_id: "credits.aleo",
        mapping_name: "bonded",
        key: address,
      },
    }),
  });

  if (!res?.result) {
    return "0";
  }

  return BigNumber(JSON.parse(getFormattedAleoString(res.result))["microcredits"].slice(0, -3)).toString();
};

export const getPAleoBalanceByAddress = async ({
  apiUrl,
  address,
  tokenId,
  mtspProgramId,
}: {
  apiUrl: string;
  address: string;
  tokenId: string;
  mtspProgramId: string;
}) => {
  const tokenOwnerHash = await getTokenOwnerHashByAddress({ apiUrl, tokenId, address });

  const res = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMappingValue",
      params: {
        program_id: mtspProgramId,
        mapping_name: "authorized_balances",
        key: tokenOwnerHash,
      },
    }),
  });

  if (!res?.result) {
    return "0";
  }

  return BigNumber(JSON.parse(getFormattedAleoString(res.result))["balance"].slice(0, -4)).toString();
};

export const getTokenOwnerHashByAddress = async ({
  apiUrl,
  address,
  tokenId,
}: {
  apiUrl: string;
  address: string;
  tokenId: string;
}) => {
  const res = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenOwnerHash",
      params: {
        address,
        tokenId,
      },
    }),
  });

  if (!res?.result) {
    return undefined;
  }

  return res.result;
};

export const getAleoAddressUnbondingStatus = async ({
  apiUrl,
  address,
  stakingType,
  pondoProgramId,
}: {
  apiUrl: string;
  address: string;
  stakingType: StakingType | null;
  pondoProgramId: string;
}) => {
  const latestBlockHeight = await getAleoLatestBlockHeight({ apiUrl });
  const unbondingPosition = await (stakingType === "liquid"
    ? getAleoAddressLiquidUnbondingPosition({ apiUrl, address, pondoProgramId })
    : getAleoAddressUnbondingPosition({ apiUrl, address }));

  if (!unbondingPosition || !unbondingPosition.microCredits) return null;

  const amount = unbondingPosition.microCredits;
  const isWithdrawable = latestBlockHeight >= unbondingPosition.height;
  const estWaitTimeInSecs = isWithdrawable ? undefined : (unbondingPosition.height - latestBlockHeight) * 5;
  const estCompletionTimestamp = !estWaitTimeInSecs ? undefined : new Date(Date.now() + estWaitTimeInSecs * 1000);

  return {
    amount,
    isWithdrawable,
    completionTime: getTimeDiffInSingleUnits(estCompletionTimestamp),
  };
};

export const getAleoLatestBlockHeight = async ({ apiUrl }: { apiUrl: string }) => {
  const res = await fetchData(`${apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "latest/height",
    }),
  });
  return res.result;
};

export const getAleoAddressUnbondingPosition = async ({ apiUrl, address }: { apiUrl: string; address: string }) => {
  const res = await fetchData(`${apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMappingValue",
      params: {
        program_id: "credits.aleo",
        mapping_name: "unbonding",
        key: address,
      },
    }),
  });
  return getFormattedUnbondingPosition(res.result);
};

export const getAleoAddressLiquidUnbondingPosition = async ({
  apiUrl,
  address,
  pondoProgramId,
}: {
  apiUrl: string;
  address: string;
  pondoProgramId: string;
}) => {
  const res = await fetchData(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMappingValue",
      params: {
        program_id: pondoProgramId,
        mapping_name: "withdrawals",
        key: address,
      },
    }),
  });
  return getFormattedUnbondingPosition(res.result);
};

const getFormattedUnbondingPosition = (data: string | null) => {
  if (!data) return null;

  try {
    const processedText = data
      .replace(/\\n/g, "")
      .replace(/\s/g, "")
      .replace(/"/g, "")
      .replace(/(\w+):/g, '"$1":')
      .replace(/u64/g, "")
      .replace(/u32/g, "");

    const value = JSON.parse(processedText);
    return {
      microCredits: value.microcredits as number,
      height: (value.height || value.claim_block) as number,
    };
  } catch (error) {
    console.error("Error parsing text to object:", error);
    throw error;
  }
};
