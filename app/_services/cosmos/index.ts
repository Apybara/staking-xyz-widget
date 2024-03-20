import type { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import type { Asset, AssetList } from "@chain-registry/types";
import type { CosmosNetwork } from "../../types";
import type { GetBalanceProps } from "./types";
import BigNumber from "bignumber.js";
import { cosmos } from "juno-network";
import { assets } from "chain-registry";
import { networkDenom } from "../../consts";

export const getBalance = async ({ address, getRpcEndpoint, network }: GetBalanceProps) => {
  if (!getRpcEndpoint || !address) {
    throw new Error("Missing parameter: getRpcEndpoint, address.");
  }

  try {
    const chainAssets = getChainAssets(network);
    const exponent = getExponent(network);
    const rpcEndpoint = await getRPCEndpoint({ getRpcEndpoint, network });
    const stringifyRPCEndpoint =
      typeof rpcEndpoint === "string" ? rpcEndpoint : (rpcEndpoint as ExtendedHttpEndpoint).url;
    const client = await cosmos.ClientFactory.createRPCQueryClient({ rpcEndpoint: stringifyRPCEndpoint });
    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: chainAssets?.assets[0].base || "",
    });

    const a = new BigNumber(balance.balance?.amount || 0);
    const amount = a.multipliedBy(10 ** -exponent);
    return amount.toString();
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

const getExponent = (network: CosmosNetwork) => {
  const coin = getCoin(network);
  return coin.denom_units.find((unit) => unit.denom === coin.display)?.exponent || 0;
};

const getCoin = (network: CosmosNetwork) => {
  const chainAssets = getChainAssets(network);
  const denomDisplayName = networkDenom[network].toLowerCase();
  return chainAssets.assets.find((asset) => asset.display === denomDisplayName) as Asset;
};

const getChainAssets = (network: CosmosNetwork) => {
  return assets.find((chain) => chain.chain_name === network) as AssetList;
};
