import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideRewardsPage } from "./_components/ClientSideRewardsPage";

export default async function Rewards({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "rewards");
  await revalidatePageQueries(network);

  return <ClientSideRewardsPage searchParams={searchParams} />;
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards", networkParam: searchParams?.network });
}
