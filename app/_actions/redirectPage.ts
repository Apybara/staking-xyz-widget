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
    current.delete("validator");
  }

  if (
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
