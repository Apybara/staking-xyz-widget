import { fetchData } from "@/app/_utils/fetch";
import { getTimeDiffInSingleUnits } from "@/app/_utils/time";

export const getAleoAddressUnbondingStatus = async ({ apiUrl, address }: { apiUrl: string; address: string }) => {
  const latestBlockHeight = await getAleoLatestBlockHeight({ apiUrl });
  const unbondingPosition = await getAleoAddressUnbondingPosition({ apiUrl, address });

  if (!unbondingPosition || !unbondingPosition.microCredits) return null;

  const amount = unbondingPosition.microCredits;
  const isClaimable = latestBlockHeight >= unbondingPosition.height;
  const estWaitTimeInSecs = isClaimable ? undefined : (unbondingPosition.height - latestBlockHeight) * 5;
  const estCompletionTimestamp = !estWaitTimeInSecs ? undefined : new Date(Date.now() + estWaitTimeInSecs * 1000);

  return {
    amount,
    isClaimable,
    completionTime: getTimeDiffInSingleUnits(estCompletionTimestamp),
  };
};

export const getAleoLatestBlockHeight = async ({ apiUrl }: { apiUrl: string }) => {
  const res: number = await fetchData(`${apiUrl}latest/height`);
  return res;
};

export const getAleoAddressUnbondingPosition = async ({ apiUrl, address }: { apiUrl: string; address: string }) => {
  const res = await fetchData(`${apiUrl}program/credits.aleo/mapping/unbonding/${address}`);
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
