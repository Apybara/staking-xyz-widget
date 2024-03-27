import type { ChainWalletContext } from "@cosmos-kit/core";
import type { CosmosNetwork } from "../../types";

export type GetBalanceProps = {
  address: string | null;
  network: CosmosNetwork;
  getRpcEndpoint: ChainWalletContext["getRpcEndpoint"] | null;
};
