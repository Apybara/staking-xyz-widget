import type { RouterStruct, Network } from "../types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { networkRegex, currencyRegex, networkCoinPriceSymbol } from "../consts";

export default function Home({ searchParams }: RouterStruct) {
  const { network, currency } = searchParams || {};
  if (!network || !networkRegex.test(network)) {
    redirect("/?network=celestia&currency=usd");
  }
  if (!currencyRegex.test(currency || "")) {
    redirect(`/?network=${network}&currency=usd`);
  }

  revalidateTag("coin-price" + networkCoinPriceSymbol[network as Network]);

  return (
    <nav style={{ marginTop: "5rem" }}>
      <Link href="/stake">Stake</Link>
    </nav>
  );
}
