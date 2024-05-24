import type { Network } from "../../types";
import BigNumber from "bignumber.js";
import { feeRatioByNetwork } from "../../consts";

export const getFeeCollectingAmount = ({ amount, network }: { amount: string; network: Network }) => {
  return Math.floor(BigNumber(amount).times(feeRatioByNetwork[network]).toNumber()).toString();
};
