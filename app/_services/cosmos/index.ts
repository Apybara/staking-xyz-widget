import type { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import type { GetBalanceProps } from "./types";
import { cosmos } from "juno-network";
import { getDenomUnitValue, getChainAssets } from "./utils";

export const getBalance = async ({ address, getRpcEndpoint, network }: GetBalanceProps) => {
  if (!getRpcEndpoint || !address) {
    throw new Error("Missing parameter: getRpcEndpoint, address.");
  }

  try {
    const chainAssets = getChainAssets(network);
    const rpcEndpoint = await getRPCEndpoint({ getRpcEndpoint, network });
    const stringifyRPCEndpoint =
      typeof rpcEndpoint === "string" ? rpcEndpoint : (rpcEndpoint as ExtendedHttpEndpoint).url;
    const client = await cosmos.ClientFactory.createRPCQueryClient({ rpcEndpoint: stringifyRPCEndpoint });
    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: chainAssets?.assets[0].base || "",
    });

    return getDenomUnitValue({ network, amount: balance.balance?.amount });
  } catch (e) {
    throw e;
  }
};

const getRPCEndpoint = async ({ getRpcEndpoint, network }: Pick<GetBalanceProps, "getRpcEndpoint" | "network">) => {
  if (!getRpcEndpoint) {
    const error = new Error("Missing parameter: getRpcEndpoint.");
    throw error;
  }

  const rpcEndpoint = await getRpcEndpoint();
  if (!rpcEndpoint) {
    console.info("no rpc endpoint — using a fallback");
    return `https://rpc.cosmos.directory/${network}`;
  }
  return rpcEndpoint;
};
