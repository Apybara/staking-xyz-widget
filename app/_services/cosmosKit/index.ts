import type { Network } from "../../types";
import { cosmosNetworkVariants } from "../../consts";

export const getIsCosmosNetwork = (network?: Network | null) =>
  cosmosNetworkVariants.some((variant) => variant === network);
