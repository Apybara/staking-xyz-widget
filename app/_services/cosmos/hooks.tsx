import type { SigningStargateClient } from "@cosmjs/stargate";
import type { BaseStakeProcedure } from "../../_services/stake/types";
import type { CosmosNetwork, Network, CosmosWalletType } from "../../types";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDelegateMessage } from "../../_services/celestiaStakingAPI";
import { useCelestiaAddressAuthCheck } from "../../_services/celestiaStakingAPI/hooks";
import { cosmosNetworkVariants, networkInfo } from "../../consts";
import { getIsCosmosKitWalletType } from "./cosmosKit/utils";
import {
  useCosmosKitConnectors,
  useCosmosKitDisconnector,
  useCosmosKitWalletBalance,
  useCosmosKitWalletStates,
  useCosmosKitWalletSupports,
} from "./cosmosKit/hooks";
import { useGrazConnectors, useGrazDisconnector, useGrazWalletBalance, useGrazWalletStates } from "./graz/hooks";
import { getDenomValueFromCoin, getIsCosmosNetwork } from "./utils";
import { getSigningClient, getGrantingMessages, getEstimatedGas, getFee } from ".";

export const useCosmosStakingProcedures = ({
  amount,
  network,
  address,
  authStep,
  cosmosSigningClient,
  delegateStep,
}: {
  amount: string;
  network: Network | null;
  address: string | null;
  cosmosSigningClient?: SigningStargateClient;
  authStep: {
    onLoading: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
  delegateStep: {
    onLoading: () => void;
    onSuccess: (txHash?: string) => void;
    onError: (e: Error) => void;
  };
}) => {
  const isCosmosNetwork = getIsCosmosNetwork(network || "");
  const {
    data: isAddressAuthorized,
    isLoading,
    refetch,
  } = useCelestiaAddressAuthCheck({ address: address || undefined });

  const cosmosAuthTx = useCosmosBroadcastAuthzTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    onLoading: authStep.onLoading,
    onSuccess: authStep.onSuccess,
    onError: authStep.onError,
  });
  const cosmosDelegateTx = useCosmosBroadcastDelegateTx({
    client: cosmosSigningClient || null,
    network: network && isCosmosNetwork ? network : undefined,
    address: address || undefined,
    amount,
    onLoading: delegateStep.onLoading,
    onSuccess: delegateStep.onSuccess,
    onError: delegateStep.onError,
  });

  // TODO: handle error state
  if (!isCosmosNetwork || !address || isLoading) return null;

  const base = [
    {
      step: "delegate",
      stepName: "Sign in wallet",
      send: cosmosDelegateTx.send,
    } as BaseStakeProcedure,
  ];
  const baseProcedures: Array<BaseStakeProcedure> = isAddressAuthorized
    ? base
    : [
        {
          step: "auth",
          stepName: "Approval in wallet",
          send: cosmosAuthTx.send,
        },
        ...base,
      ];

  return {
    baseProcedures,
    firstStep: baseProcedures[0].step,
    refetchAuthCheck: refetch,
  };
};

const useCosmosBroadcastAuthzTx = ({
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
    mutationKey: ["broadcastCosmosAuthzTx", address, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      const grantingMsgs = getGrantingMessages({ granter: address, grantee: granteeAddress[network || "celestia"] });
      const estimatedGas = await getEstimatedGas({ client, address, msgArray: grantingMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: networkInfo[network || "celestia"].denom,
      });

      return await client.signAndBroadcast(address, grantingMsgs, fee);
    },
    onSuccess: (res) => onSuccess?.(res.transactionHash),
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

const useCosmosBroadcastDelegateTx = ({
  client,
  amount,
  network,
  address,
  onLoading,
  onSuccess,
  onError,
}: {
  client: SigningStargateClient | null;
  amount: string;
  network?: CosmosNetwork;
  address?: string;
  onLoading?: () => void;
  onSuccess?: (txHash: string) => void;
  onError?: (e: Error) => void;
}) => {
  const { isPending, error, mutate, reset } = useMutation({
    mutationKey: ["broadcastCosmosDelegateTx", address, amount, network],
    mutationFn: async () => {
      if (!client || !address) {
        throw new Error("Missing parameter: client, address");
      }

      const denomAmount = getDenomValueFromCoin({ network: network || "celestia", amount });
      const unsignedResponse = await getDelegateMessage(address, Number(denomAmount));
      const parsedUnsigned = JSON.parse(atob(unsignedResponse));
      const validatorAddress = parsedUnsigned?.body?.messages?.[0]?.["validator_address"] || "";

      const delegateMsgs = [
        {
          typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
          value: {
            delegatorAddress: address,
            validatorAddress,
            amount: {
              denom: networkInfo[network || "celestia"].denom,
              amount: denomAmount,
            },
          },
        },
        // TODO: add fee collection message
      ];
      const estimatedGas = await getEstimatedGas({ client, address, msgArray: delegateMsgs });
      const fee = getFee({
        gasLimit: estimatedGas,
        network: network || "celestia",
        networkDenom: networkInfo[network || "celestia"].denom,
      });

      return await client.signAndBroadcast(address, delegateMsgs, fee);
    },
    onSuccess: (res) => onSuccess?.(res.transactionHash),
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
  const {
    data: signingClient,
    isLoading,
    error,
  } = useQuery({
    enabled: !!network,
    queryKey: ["cosmosSigningClient", network],
    queryFn: () => getSigningClient({ network }),
  });

  return { data: signingClient, isLoading, error };
};

const granteeAddress: Record<CosmosNetwork, string> = {
  celestia: process.env.NEXT_PUBLIC_CELESTIA_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_AUTH_GRANTEE || "celestia1kwe3z6wyq9tenu24a80z4sh6yv2w5xjp8zzukf",
};
