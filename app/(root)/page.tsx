import type { RouterStruct, Network } from "../types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { networkRegex, currencyRegex, networkCoinPriceSymbol } from "../consts";
import { getCurrentSearchParams } from "../_utils/routes";

export default function Home({ searchParams, ...props }: RouterStruct) {
  const { network, currency } = searchParams || {};
  const current = getCurrentSearchParams(searchParams);

  if (!network || !networkRegex.test(network)) {
    current.set("network", "celestia");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${query}`);
  }
  if (!currencyRegex.test(currency || "")) {
    current.set("currency", "usd");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    redirect(`/${query}`);
  }

  revalidateTag("coin-price" + networkCoinPriceSymbol[network as Network]);

  return (
    <nav style={{ marginTop: "5rem" }}>
      <Link href="/stake">Stake</Link>
    </nav>
  );
}
