import type { RouterStruct } from "../types";
import Link from "next/link";
import { revalidatePageQueries } from "../_actions/query";
import { redirectPage } from "../_actions/routes";
import { getLinkWithSearchParams } from "../_utils/routes";

export default function Home({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  redirectPage(searchParams, "");
  revalidatePageQueries(network);

  return (
    <nav style={{ display: "flex", gap: 24 }}>
      <Link href={getLinkWithSearchParams(searchParams, "stake")}>Stake</Link>
      <Link href={getLinkWithSearchParams(searchParams, "unstake")}>Unstake</Link>
      <Link href={getLinkWithSearchParams(searchParams, "rewards")}>Rewards</Link>
      <Link href={getLinkWithSearchParams(searchParams, "activity")}>Activity</Link>
    </nav>
  );
}
