import BigNumber from "bignumber.js";
import type { Network } from "../../types";
import { feeRatioByNetwork, gasFeeRatioByNetwork } from "../../consts";

export const getFeeCollectingAmount = ({ amount, network }: { amount: string; network: Network }) => {
  return Math.floor(BigNumber(amount).times(feeRatioByNetwork[network]).toNumber()).toString();
};

export const getGasFeeEstimationAmount = ({ amount, network }: { amount: string; network: Network }) => {
  return Math.floor(BigNumber(amount).times(gasFeeRatioByNetwork[network]).toNumber()).toString();
};
