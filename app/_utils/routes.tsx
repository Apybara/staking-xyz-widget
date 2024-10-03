import type { Network, RouterStruct } from "../types";
import { useSearchParams } from "next/navigation";
import { defaultNetwork, networkIdToUrlParamAlias, networkUrlParamToId } from "../consts";
import { getIsNetworkValid } from ".";

export const getCurrentSearchParams = (searchParams: RouterStruct["searchParams"]) => {
  const { network, currency, device, validator, userId, stakingType } = searchParams || {};
  const params = new Array();

  if (network?.length) params.push(["network", network]);
  if (currency?.length) params.push(["currency", currency]);
  if (device?.length) params.push(["device", device]);
  if (validator?.length) params.push(["validator", validator]);
  if (userId?.length) params.push(["userId", userId]);
  if (stakingType?.length) params.push(["stakingType", stakingType]);

  return new URLSearchParams(params);
};

export const getLinkWithSearchParams = (searchParams: RouterStruct["searchParams"], page: string) => {
  const current = getCurrentSearchParams(searchParams);
  const search = current.toString();
  const query = search ? `?${search}` : "";
  return `/${page}${query}`;
};

export const useLinkWithSearchParams = (page: string) => {
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const search = current.toString();
  const query = search ? `?${search}` : "";

  return `/${page}${query}`;
};

export const getNetworkParamFromValidAlias = (network: string) => {
  if (getIsNetworkValid(network)) {
    return {
      network: networkUrlParamToId[network],
      alias: networkIdToUrlParamAlias[network as Network],
    };
  }

  if (/\b(celestiatestnet3|mocha-4|mocha4)\b/.test(network)) {
    return {
      network: networkUrlParamToId.celestiatestnet3,
      alias: networkIdToUrlParamAlias.celestiatestnet3,
    };
  }
  if (/\b(cosmoshub|cosmoshub-4)\b/.test(network)) {
    return {
      network: networkUrlParamToId.cosmoshub,
      alias: networkIdToUrlParamAlias.cosmoshub,
    };
  }
  if (/\b(cosmoshubtestnet|theta-testnet-001)\b/.test(network)) {
    return {
      network: networkUrlParamToId.cosmoshubtestnet,
      alias: networkIdToUrlParamAlias.cosmoshubtestnet,
    };
  }

  return {
    network: defaultNetwork,
    alias: networkIdToUrlParamAlias[defaultNetwork],
  };
};
