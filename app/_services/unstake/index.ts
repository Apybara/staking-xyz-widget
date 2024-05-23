import type { Network } from "../../types";
import BigNumber from "bignumber.js";
import { requiredBalanceByNetwork } from "../../consts";

export const getRequiredBalance = ({ network }: { network: Network }) => {
  return BigNumber(requiredBalanceByNetwork[network]).toString();
};
