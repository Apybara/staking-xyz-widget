import type { SigningStargateClient } from "@cosmjs/stargate";
import type { CosmosNetwork, CosmosWalletType } from "../../types";
import { useEffect } from "react";
import { cosmos } from "juno-network";
import useLocalStorage from "use-local-storage";
import { useChain } from "@cosmos-kit/react-lite";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cosmosNetworkVariants, networkDenom } from "../../consts";
import { getIsCosmosKitWalletType } from "./cosmosKit/utils";
import {
  useCosmosKitConnectors,
  useCosmosKitDisconnector,
  useCosmosKitWalletBalance,
  useCosmosKitWalletStates,
  useCosmosKitWalletSupports,
} from "./cosmosKit/hooks";
import { useGrazConnectors, useGrazDisconnector, useGrazWalletBalance, useGrazWalletStates } from "./graz/hooks";
import { getSigningClient, getEstimatedGas, getFee } from ".";

const { StakeAuthorization } = cosmos.staking.v1beta1;
const { GenericAuthorization } = cosmos.authz.v1beta1;

export const useCosmosBroadcastAuthzTx = ({
  client,
  network,
  address,
  onLoading,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  network?: CosmosNetwork;
  address?: string;
  onLoading?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { isPending, error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosAuthzTx", address, client],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      // const msgs = await getStakeUnsignedMsg(address);
      // const parsedMsgs = JSON.parse(msgs).body.messages;

      const tempAuthMsgs = [
        {
          typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
          value: {
            granter: address,
            grantee: "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
            grant: {
              authorization: {
                typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
                value: StakeAuthorization.encode(
                  StakeAuthorization.fromPartial({
                    allowList: { address: ["celestiavaloper1e2p4u5vqwgum7pm9vhp0yjvl58gvhfc6yfatw4"] },
                    maxTokens: {
                      denom: "utia",
                      amount: "1",
                    },
                    authorizationType: 1,
                  }),
                ).finish(),
              },
            },
          },
        },
        // {
        //   typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        //   value: {
        //     granter: address,
        //     grantee: "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
        //     grant: {
        //       authorization: {
        //         typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
        //         value: StakeAuthorization.encode(StakeAuthorization.fromPartial({
        //           allowList: { address: ['celestiavaloper1e2p4u5vqwgum7pm9vhp0yjvl58gvhfc6yfatw4'] },
        //           maxTokens: {
        //             denom: "utia",
        //             amount: '1',
        //           },
        //           authorizationType: 2
        //         })).finish(),
        //       },
        //     },
        //   },
        // },
        // {
        //   typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        //   value: {
        //     granter: address,
        //     grantee: "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
        //     grant: {
        //       authorization: {
        //         typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
        //         value: StakeAuthorization.encode(StakeAuthorization.fromPartial({
        //           allowList: { address: ['celestiavaloper1e2p4u5vqwgum7pm9vhp0yjvl58gvhfc6yfatw4'] },
        //           maxTokens: {
        //             denom: "utia",
        //             amount: '1',
        //           },
        //           authorizationType: 3
        //         })).finish(),
        //       },
        //     },
        //   },
        // },
        // {
        //   typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        //   value: {
        //     granter: address,
        //     grantee: "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
        //     grant: {
        //       authorization: {
        //         typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
        //         value: GenericAuthorization.encode(GenericAuthorization.fromPartial({
        //           msg: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        //         })).finish(),
        //       },
        //     },
        //   },
        // },
      ];

      const estimatedGas = await getEstimatedGas({ client, address, msgArray: tempAuthMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: "u" + networkDenom[network || "celestia"].toLowerCase(),
      });

      return await client.signAndBroadcast(address, tempAuthMsgs, fee);
    },
    onSuccess: (res) => {
      console.log(">>> res", res);
      onSuccess?.(res.transactionHash);
    },
    onError: (error) => onError?.(error),
  });

  useEffect(() => {
    if (isPending) {
      onLoading?.();
    }
  }, [isPending]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error]);

  return {
    reset,
    send: mutate,
  };
};

export const useCosmosWalletHasStoredConnection = () => {
  const [cosmosKitStorage] = useLocalStorage<
    Array<{
      address: string;
      chainId: string;
      namespace: string;
      username: string;
    }>
  >("cosmos-kit@2:core//accounts", []);
  const [grazStorage] = useLocalStorage<{
    state: {
      recentChainIds: Array<string> | null;
      _reconnect: boolean | null;
      _reconnectConnector: string | null;
    };
  }>("graz-internal", { state: { recentChainIds: null, _reconnect: null, _reconnectConnector: null } });

  const isCosmosKitStored = cosmosKitStorage?.some((s) => cosmosNetworkVariants.some((v) => v === s.chainId));
  const isGrazStored = grazStorage?.state?._reconnectConnector !== null;

  return isCosmosKitStored || isGrazStored;
};

export const useCosmosWalletStates = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const cosmosKitStates = useCosmosKitWalletStates({ network });
  const grazStates = useGrazWalletStates({ network });

  if (grazStates.activeWallet && grazStates.address) {
    return grazStates;
  }
  if (cosmosKitStates.activeWallet && cosmosKitStates.address) {
    return cosmosKitStates;
  }
  return cosmosKitStates.activeWallet ? cosmosKitStates : grazStates;
};

export const useCosmosWalletBalance = ({
  address,
  network,
  activeWallet,
}: {
  address: string | null;
  network: CosmosNetwork | null;
  activeWallet: CosmosWalletType | null;
}) => {
  const cosmosKitBalance = useCosmosKitWalletBalance({ address, network, activeWallet });
  const grazBalance = useGrazWalletBalance({ address, network, activeWallet });

  if (!activeWallet) {
    return null;
  }
  if (getIsCosmosKitWalletType(activeWallet)) {
    return cosmosKitBalance;
  }
  return grazBalance;
};

export const useCosmosWalletConnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const { keplr: keplrConnect, leap: leapConnect, okx: okxConnect } = useCosmosKitConnectors(network);
  const { keplrMobile, leapMobile, walletConnect } = useGrazConnectors(network);

  return {
    keplr: keplrConnect,
    keplrMobile,
    leap: leapConnect,
    leapMobile,
    okx: okxConnect,
    walletConnect,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletDisconnectors = ({ network = "celestia" }: { network?: CosmosNetwork }) => {
  const disconnectCosmosKit = useCosmosKitDisconnector({ network });
  const disconnectGraz = useGrazDisconnector({ network });

  return {
    keplr: disconnectCosmosKit,
    keplrMobile: disconnectGraz,
    leap: disconnectCosmosKit,
    leapMobile: disconnectGraz,
    okx: disconnectCosmosKit,
    walletConnect: disconnectGraz,
  } as Record<CosmosWalletType, () => Promise<void> | null>;
};

export const useCosmosWalletSupports = () => {
  const { keplr: isKeplrSupported, leap: isLeapSupported, okx: isOkxSupported } = useCosmosKitWalletSupports();

  return {
    keplr: isKeplrSupported,
    keplrMobile: true,
    leap: isLeapSupported,
    leapMobile: true,
    okx: isOkxSupported,
    walletConnect: true,
  } as Record<CosmosWalletType, boolean>;
};

export const useCosmosSigningClient = ({ network }: { network?: CosmosNetwork }) => {
  const { getSigningStargateClient } = useChain(network || "celestia");

  const {
    data: signingClient,
    isLoading,
    error,
  } = useQuery({
    enabled: !!network,
    queryKey: ["cosmosSigningClient", network, getSigningStargateClient],
    queryFn: () => getSigningClient({ network, getSigningStargateClient }),
  });

  return { data: signingClient, isLoading, error };
};
