"use server";

import type { RouterStruct } from "../types";
import { redirect } from "next/navigation";
import { networkRegex, currencyRegex } from "../consts";
import { getCurrentSearchParams } from "../_utils/routes";

export default async function redirectPage(searchParams: RouterStruct["searchParams"], page: string) {
  const { network, currency } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);

  if (!network || !networkRegex.test(network)) {
    current.set("network", "celestia");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${page}${query}`);
  }
  if (!currencyRegex.test(currency || "")) {
    current.set("currency", "usd");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${page}${query}`);
  }
}
