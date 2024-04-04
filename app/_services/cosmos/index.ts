import type { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import type { CosmosNetwork } from "../../types";
import type { GetBalanceProps } from "./types";
import { ceil } from "mathjs";
import BigNumber from "bignumber.js";
import { cosmos } from "juno-network";
import { SigningStargateClient, coin } from "@cosmjs/stargate";
import { networkDefaultGasPrice, networkEndpoints } from "../../consts";
import { getDenomUnitValue, getChainAssets } from "./utils";

export const getSigningClient = async ({
  network,
  getSigningStargateClient,
}: {
  network?: CosmosNetwork;
  getSigningStargateClient: () => Promise<SigningStargateClient>;
}) => {
  try {
    return await getSigningStargateClient();
  } catch (e) {
    try {
      if (!network || !window.getOfflineSigner) {
        throw new Error("Missing parameter: network, networkRpcEndpoint.");
      }
      const offlineSigner = window.getOfflineSigner(network);
      return await SigningStargateClient.connectWithSigner(networkEndpoints[network].rpc, offlineSigner);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};

export const getEstimatedGas = async ({
  client,
  address,
  msgArray,
  memo = "",
}: {
  client: SigningStargateClient;
  address: string;
  msgArray: Array<any>;
  memo?: string;
}) => {
  try {
    const res = await client.simulate(address, msgArray, memo);
    return Math.floor(res * 1.5);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getFee = ({
  gasLimit,
  gasPrice,
  network,
  networkDenom,
}: {
  gasLimit?: number;
  gasPrice?: number;
  network: CosmosNetwork;
  networkDenom: string;
}) => {
  if (!gasLimit) gasLimit = 200000;
  if (!gasPrice) gasPrice = networkDefaultGasPrice[network] || 0.02;

  const amount = ceil(new BigNumber(gasPrice).multipliedBy(gasLimit).toNumber());
  return {
    amount: [coin(amount, networkDenom)],
    gas: gasLimit.toString(),
  };
};

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
    return `${networkEndpoints[network]}${network}` || `https://rpc.cosmos.directory/${network}`;
  }
  return rpcEndpoint;
};
