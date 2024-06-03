import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideRedelegatePage } from "./_components/ClientSideRedelegatePage";

export default async function Stake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "import");
  await revalidatePageQueries(network);

  return <ClientSideRedelegatePage searchParams={searchParams} />;
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Import", networkParam: searchParams?.network });
}
