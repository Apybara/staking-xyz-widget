import BigNumber from "bignumber.js";
import numbro from "numbro";

export const getLastOffset = ({ totalEntries, limit }: { totalEntries: number; limit: number }) => {
  const numberOfPages = Math.ceil(totalEntries / limit);
  return numberOfPages ? numberOfPages - 1 : 0;
};

export const getCalculatedRewards = (amountStaked: string, rewardRate: number) => {
  const formattedAmountStaked = BigNumber(amountStaked).toNumber();
  const base = formattedAmountStaked * rewardRate;
  const daily = base / 365;

  return {
    percentage: numbro(rewardRate * 100).format({
      mantissa: 2,
    }),
    daily,
    monthly: base / 12,
    yearly: base,
    nextCompounding: Math.ceil(1 / daily),
  };
};
