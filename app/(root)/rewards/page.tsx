import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import Link from "next/link";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { getLinkWithSearchParams } from "../../_utils/routes";

export default async function Rewards({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "rewards");
  await revalidatePageQueries(network);

  return (
    <div style={{ marginTop: "5rem" }}>
      <h1>Rewards view</h1>

      <nav style={{ marginTop: "5rem" }}>
        <Link href={getLinkWithSearchParams(searchParams, "")}>Back to home</Link>
      </nav>
    </div>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards", networkParam: searchParams?.network });
}
