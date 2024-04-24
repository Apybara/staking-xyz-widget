import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideMorePage } from "./_components/ClientSideMorePage";

export default async function More({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "more");
  await revalidatePageQueries(network);

  return <ClientSideMorePage searchParams={searchParams} />;
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "More", networkParam: searchParams?.network });
}
