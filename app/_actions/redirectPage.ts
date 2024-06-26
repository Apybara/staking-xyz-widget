"use server";

import type { Network, RouterStruct } from "../types";
import { redirect } from "next/navigation";
import {
  defaultNetwork,
  networkUrlParamRegex,
  networkIdToUrlParamAlias,
  currencyRegex,
  networkCurrency,
  networkDefaultStakingType,
} from "../consts";
import { getCurrentSearchParams } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency, stakingType } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);
  const defaultStakingType = networkDefaultStakingType[(network as Network) || defaultNetwork];
  const isStakingTypeInvalid = stakingType && !defaultStakingType;
  const isStakingTypeExpected = !stakingType && !!defaultStakingType;

  // if (network?.toLowerCase() === "aleo") {
  //   redirect("https://aleo.staking.xyz");
  // }

  const isNetworkInvalid = !network || !networkUrlParamRegex.test(network);
  const isCurrencyInvalid = !currencyRegex.test(currency || "");
  const isImportPage = page === "import";

  if (isNetworkInvalid) {
    const targetParamFromAlias = getNetworkParamFromValidAlias(network || "");
    const targetNetwork = targetParamFromAlias || defaultNetwork;
    current.set("network", targetNetwork);
  }
  if (isCurrencyInvalid) {
    current.set("currency", networkCurrency[defaultNetwork]);
  }
  if (isStakingTypeInvalid) {
    current.delete("stakingType");
  }
  if (isStakingTypeExpected) {
    current.set("stakingType", defaultStakingType);
  }

  if (isNetworkInvalid || isCurrencyInvalid || isImportPage || isStakingTypeInvalid || isStakingTypeExpected) {
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${isImportPage ? "" : page}${query}`);
  }
}

const getNetworkParamFromValidAlias = (network: string) => {
  if (/\b(celestiatestnet3|mocha-4|mocha4)\b/.test(network)) return networkIdToUrlParamAlias.celestiatestnet3;
  if (/\b(cosmoshub|cosmoshub-4)\b/.test(network)) return networkIdToUrlParamAlias.cosmoshub;
  if (/\b(cosmoshubtestnet|theta-testnet-001)\b/.test(network)) return networkIdToUrlParamAlias.cosmoshubtestnet;
};
