import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import Link from "next/link";
import { redirectPage } from "../../_actions/routes";
import { revalidatePageQueries } from "../../_actions/query";
import { getLinkWithSearchParams } from "../../_utils/routes";

export default function Stake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  redirectPage(searchParams, "stake");
  revalidatePageQueries(network);

  return (
    <div style={{ marginTop: "5rem" }}>
      <h1>Stake view</h1>

      <nav style={{ marginTop: "5rem" }}>
        <Link href={getLinkWithSearchParams(searchParams, "")}>Back to home</Link>
      </nav>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Stake | Staking.xyz",
  description: "Your portal to staking",
};
