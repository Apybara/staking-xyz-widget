import { getTimeDiffInSingleString } from "@/app/_utils/time";
import BigNumber from "bignumber.js";
import moment from "moment";
import numbro from "numbro";

export const getLastOffset = ({ totalEntries, limit }: { totalEntries: number; limit: number }) => {
  const numberOfPages = Math.ceil(totalEntries / limit);
  return numberOfPages ? numberOfPages - 1 : 0;
};

export const getCalculatedRewards = (amountStaked: string, rewardRate: number) => {
  const formattedAmountStaked = BigNumber(amountStaked).toNumber();
  const base = formattedAmountStaked * rewardRate;
  const daily = base / 365;

  const nextCompoundingDays = Math.ceil(1 / daily);
  const nextCompoundingDate = moment().add(nextCompoundingDays, "d").toDate();

  return {
    percentage: numbro(rewardRate * 100).format({
      mantissa: 2,
    }),
    daily,
    monthly: base / 12,
    yearly: base,
    nextCompoundingDays,
    nextCompounding: nextCompoundingDays > 100 ? ">100d" : getTimeDiffInSingleString(nextCompoundingDate),
  };
};
