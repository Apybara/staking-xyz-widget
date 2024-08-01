import type { StakingType } from "@/app/types";
import { fetchData } from "@/app/_utils/fetch";
import { getTimeDiffInSingleUnits } from "@/app/_utils/time";

export const getAleoAddressUnbondingStatus = async ({
  apiUrl,
  address,
  stakingType,
}: {
  apiUrl: string;
  address: string;
  stakingType: StakingType | null;
}) => {
  const latestBlockHeight = await getAleoLatestBlockHeight({ apiUrl });
  const unbondingPosition = await (stakingType === "liquid"
    ? getAleoAddressLiquidUnbondingPosition({ apiUrl, address })
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
}: {
  apiUrl: string;
  address: string;
}) => {
  const res = await fetchData(`${apiUrl}program/pondo_core_protocolv1.aleo/mapping/unbonding/${address}`);
  return getFormattedUnbondingPosition(res);
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
      height: value.height as number,
    };
  } catch (error) {
    console.error("Error parsing text to object:", error);
    throw error;
  }
};
