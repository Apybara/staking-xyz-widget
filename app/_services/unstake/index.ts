import type { Network } from "../../types";
import BigNumber from "bignumber.js";
import { unstakeFeeRatioByNetwork } from "../../consts";

export const getFeeCollectingAmount = ({ amount, network }: { amount: string; network: Network }) => {
  return Math.floor(BigNumber(amount).times(unstakeFeeRatioByNetwork[network]).toNumber()).toString();
};
