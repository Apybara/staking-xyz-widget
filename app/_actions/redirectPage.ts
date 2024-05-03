"use server";

import type { RouterStruct } from "../types";
import { redirect } from "next/navigation";
import { defaultNetwork, networkRegex, currencyRegex, networkCurrency } from "../consts";
import { getCurrentSearchParams } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);

  if (network?.toLowerCase() === "aleo") {
    redirect("https://aleo.staking.xyz");
  }

  const isNetworkInvalid = !network || !networkRegex.test(network);
  const isCurrencyInvalid = !currencyRegex.test(currency || "");

  if (isNetworkInvalid) {
    current.set("network", defaultNetwork);
  }
  if (isCurrencyInvalid) {
    current.set("currency", networkCurrency[defaultNetwork]);
  }
  if (isNetworkInvalid || isCurrencyInvalid) {
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${page}${query}`);
  }
}
