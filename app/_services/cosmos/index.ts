import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import type { CosmosNetwork } from "../../types";
import type { GetBalanceProps } from "./types";
import { ceil } from "mathjs";
import BigNumber from "bignumber.js";
import { cosmos } from "juno-network";
import { Registry } from "@cosmjs/proto-signing";
import {
  AminoTypes,
  SigningStargateClient,
  defaultRegistryTypes,
  createBankAminoConverters,
  createStakingAminoConverters,
  createDistributionAminoConverters,
  coin,
} from "@cosmjs/stargate";
import { networkDefaultGasPrice, networkEndpoints } from "../../consts";
import { createAuthzAminoConverters } from "./amino";
import { getCoinValueFromDenom, getChainAssets } from "./utils";
import { cosmosChainInfoId } from "./consts";

const { GenericAuthorization } = cosmos.authz.v1beta1;

export const getSigningClient = async ({
  network,
  getOfflineSigner,
}: {
  network?: CosmosNetwork;
  getOfflineSigner?: () => Promise<OfflineSigner>;
}) => {
  try {
    if (!network) {
      throw new Error("Missing parameter: network.");
    }

    const signer = getOfflineSigner ? await getOfflineSigner() : window?.getOfflineSigner?.(cosmosChainInfoId[network]);
    if (!signer) {
      throw new Error("Missing parameter: offlineSigner.");
    }

    const registry = new Registry(defaultRegistryTypes);
    const defaultConverters = {
      ...createAuthzAminoConverters(),
      ...createDistributionAminoConverters(),
      ...createStakingAminoConverters(),
      ...createBankAminoConverters(),
    };
    const aminoTypes = new AminoTypes(defaultConverters);
    return await SigningStargateClient.connectWithSigner(networkEndpoints[network].rpc, signer, {
      registry,
      aminoTypes,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getGrantingMessages = ({ granter, grantee }: { granter: string; grantee: string }) => {
  const msgs = [
    "/cosmos.staking.v1beta1.MsgDelegate",
    "/cosmos.staking.v1beta1.MsgUndelegate",
    "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
  ];

  return msgs.map((msg) => ({
    typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
    value: {
      granter,
      grantee,
      grant: {
        authorization: {
          typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
          value: GenericAuthorization.encode(
            GenericAuthorization.fromPartial({
              msg,
            }),
          ).finish(),
        },
      },
    },
  }));
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

    return getCoinValueFromDenom({ network, amount: balance.balance?.amount });
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
