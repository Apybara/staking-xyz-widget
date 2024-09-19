"use server";

import type { Network, RouterStruct, StakingType } from "../types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ALEO_URLS, defaultNetwork, networkCurrency, networkDefaultStakingType, networkInfo } from "../consts";
import { getIsNetworkValid, getIsCurrencyValid, getIsNetworkCurrencyPairValid } from "../_utils";
import { getCurrentSearchParams, getNetworkParamFromValidAlias } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency, stakingType, validator } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);

  const headersList = headers();
  const hostname = headersList.get("x-forwarded-host");

  const isAleoUrl = ALEO_URLS.includes(hostname as string);
  const castedNetwork = isAleoUrl ? "aleo" : (network as Network) || defaultNetwork;

  const defaultStakingType = networkDefaultStakingType[castedNetwork];
  const isNetworkInvalid = !getIsNetworkValid(network);
  const isCurrencyInvalid = !getIsCurrencyValid(currency);
  const isNetworkAndCurrencyPairInvalid = !getIsNetworkCurrencyPairValid({
    network: castedNetwork,
    currency,
    page,
    stakingType: stakingType as StakingType,
  });
  const isStakingTypeInvalid = (stakingType || validator) && !defaultStakingType;
  const isStakingTypeExpected = !stakingType && !!defaultStakingType;
  const isImportPage = page === "import";
  const isValidatorSelectionUnsupported =
    !!validator && networkInfo[castedNetwork]?.supportsValidatorSelection !== true;
  const networkParamAndAlias = getNetworkParamFromValidAlias(castedNetwork || "");
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
      current.set("stakingType", defaultStakingType as string);
    }
    if (isValidatorSelectionUnsupported) {
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
