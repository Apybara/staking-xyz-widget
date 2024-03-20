import type { CosmosNetwork } from "../../types";
import type { ChainWalletContext } from "@cosmos-kit/core";

export type GetBalanceProps = {
  address: string | null;
  network: CosmosNetwork;
  getRpcEndpoint: ChainWalletContext["getRpcEndpoint"] | null;
};
