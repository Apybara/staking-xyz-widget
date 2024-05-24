import type { Network } from "../../types";
import BigNumber from "bignumber.js";
import { requiredBalanceUnstakingByNetwork } from "../../consts";

export const getRequiredBalance = ({ network }: { network: Network }) => {
  return BigNumber(requiredBalanceUnstakingByNetwork[network]).toString();
};
