"use server";

import type { Network, RouterStruct } from "../types";
import { redirect } from "next/navigation";
import { defaultNetwork, networkCurrency, networkDefaultStakingType, networkInfo } from "../consts";
import { getIsNetworkValid, getIsCurrencyValid, getIsNetworkCurrencyPairValid } from "../_utils";
import { getCurrentSearchParams, getNetworkParamFromValidAlias } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency, stakingType, validator } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);

  // if (network?.toLowerCase() === "aleo") {
  //   redirect("https://aleo.staking.xyz");
  // }

  const defaultStakingType = networkDefaultStakingType[(network as Network) || defaultNetwork];
  const isNetworkInvalid = !getIsNetworkValid(network);
  const isCurrencyInvalid = !getIsCurrencyValid(currency);
  const isNetworkAndCurrencyPairInvalid = !getIsNetworkCurrencyPairValid(network, currency);
  const isStakingTypeInvalid = (stakingType || validator) && !defaultStakingType;
  const isStakingTypeExpected = !stakingType && !!defaultStakingType;
  const isImportPage = page === "import";
  const isValidatorSelectionUnsupported =
    !!validator && networkInfo[(network as Network) || defaultNetwork]?.supportsValidatorSelection !== true;
  const networkParamAndAlias = getNetworkParamFromValidAlias(network || "");
  const isMultipleNetworks = Array.isArray(network);

  if (isMultipleNetworks) {
    current.set("network", network[0]);
    validator && current.set("validator", validator);
  } else {
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
    if (isValidatorSelectionUnsupported) {
      console.log("or here", validator);
      current.delete("validator");
    }
  }

  if (
    isMultipleNetworks ||
    isNetworkInvalid ||
    isCurrencyInvalid ||
    isNetworkAndCurrencyPairInvalid ||
    isImportPage ||
    isStakingTypeInvalid ||
    isStakingTypeExpected ||
    isValidatorSelectionUnsupported
  ) {
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${isImportPage ? "" : page}${query}`);
  }
}
