import type { RouterStruct } from "../types";
import Link from "next/link";
import revalidatePageQueries from "../_actions/revalidatePageQueries";
import redirectPage from "../_actions/redirectPage";
import { getLinkWithSearchParams } from "../_utils/routes";

export default async function Home({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "");
  await revalidatePageQueries(network);

  return (
    <nav style={{ display: "flex", gap: 24 }}>
      <Link href={getLinkWithSearchParams(searchParams, "stake")}>Stake</Link>
      <Link href={getLinkWithSearchParams(searchParams, "unstake")}>Unstake</Link>
      <Link href={getLinkWithSearchParams(searchParams, "rewards")}>Rewards</Link>
      <Link href={getLinkWithSearchParams(searchParams, "activity")}>Activity</Link>
    </nav>
  );
}
