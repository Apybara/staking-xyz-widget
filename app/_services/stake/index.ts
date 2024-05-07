import type { Network } from "../../types";
import BigNumber from "bignumber.js";
import { feeRatioByNetwork } from "../../consts";

export const getFeeCollectingAmount = ({ amount, network }: { amount: string; network: Network }) => {
  return BigNumber(amount).times(feeRatioByNetwork[network]).toString();
};
