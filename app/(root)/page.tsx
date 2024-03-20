import type { RouterStruct } from "../types";
import { redirect } from "next/navigation";
import Link from "next/link";
import { networkRegex, currencyRegex } from "../consts";

export default function Home({ searchParams }: RouterStruct) {
  const { network, currency } = searchParams || {};
  if (!network || !networkRegex.test(network)) {
    redirect("/?network=celestia&currency=usd");
  }
  if (!currencyRegex.test(currency || "")) {
    redirect(`/?network=${network}&currency=usd`);
  }

  return (
    <nav style={{ marginTop: "5rem" }}>
      <Link href="/stake">Stake</Link>
    </nav>
  );
}
