import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import Link from "next/link";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getLinkWithSearchParams } from "../../_utils/routes";

export default async function Unstake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "unstake");
  await revalidatePageQueries(network);

  return (
    <div style={{ marginTop: "5rem" }}>
      <h1>Unstake view</h1>

      <nav style={{ marginTop: "5rem" }}>
        <Link href={getLinkWithSearchParams(searchParams, "")}>Back to home</Link>
      </nav>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Unstake | Staking.xyz",
  description: "Your portal to staking",
};
