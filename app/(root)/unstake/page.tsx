import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import Link from "next/link";
import { redirectPage } from "../../_actions/routes";
import { revalidatePageQueries } from "../../_actions/query";
import { getLinkWithSearchParams } from "../../_utils/routes";

export default function Unstake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  redirectPage(searchParams, "unstake");
  revalidatePageQueries(network);

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
