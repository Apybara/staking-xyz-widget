"use server";

import type { Network, RouterStruct } from "../types";
import { redirect } from "next/navigation";
import { defaultNetwork, networkCurrency, networkDefaultStakingType } from "../consts";
import { getIsNetworkValid, getIsCurrencyValid, getIsNetworkCurrencyPairValid } from "../_utils";
import { getCurrentSearchParams, getNetworkParamFromValidAlias } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency, stakingType, validator } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);
  const defaultStakingType = networkDefaultStakingType[(network as Network) || defaultNetwork];
  const isStakingTypeInvalid = (stakingType || validator) && !defaultStakingType;
  const isStakingTypeExpected = !stakingType && !!defaultStakingType;

  // if (network?.toLowerCase() === "aleo") {
  //   redirect("https://aleo.staking.xyz");
  // }

  const isNetworkInvalid = !getIsNetworkValid(network);
  const isCurrencyInvalid = !getIsCurrencyValid(currency);
  const isNetworkAndCurrencyPairInvalid = !getIsNetworkCurrencyPairValid(network, currency);
  const isImportPage = page === "import";
  const networkParamAndAlias = getNetworkParamFromValidAlias(network || "");

  if (isNetworkInvalid) {
    current.set("network", networkParamAndAlias.alias);
  }
  if (isCurrencyInvalid || isNetworkAndCurrencyPairInvalid) {
    current.set("currency", networkCurrency[networkParamAndAlias.network]);
  }
  if (isStakingTypeInvalid) {
    current.delete("stakingType");
    current.delete("validator");
  }
  if (isStakingTypeExpected) {
    current.set("stakingType", defaultStakingType);
  }

  if (
    isNetworkInvalid ||
    isCurrencyInvalid ||
    isNetworkAndCurrencyPairInvalid ||
    isImportPage ||
    isStakingTypeInvalid ||
    isStakingTypeExpected
  ) {
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${isImportPage ? "" : page}${query}`);
  }
}
