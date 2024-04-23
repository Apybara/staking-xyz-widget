import BigNumber from "bignumber.js";
import numbro from "numbro";

export const getLastOffset = ({ totalEntries, limit }: { totalEntries: number; limit: number }) => {
  const numberOfPages = Math.ceil(totalEntries / limit);
  return numberOfPages - 1;
};

export const getCalculatedRewards = (amountStaked: string, rewardRate: number) => {
  const formattedAmountStaked = BigNumber(amountStaked).toNumber();
  const base = formattedAmountStaked * rewardRate;

  return {
    percentage: numbro(rewardRate * 100).format({
      mantissa: 2,
    }),
    daily: base / 365,
    monthly: base / 12,
    yearly: base,
  };
};
