import type { Metadata } from "next";
import type { PageProps } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideRedelegatePage } from "./_components/ClientSideRedelegatePage";

export default async function Import({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "import");

  return <ClientSideRedelegatePage searchParams={resolvedSearchParams} />;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Import", networkParam: (await searchParams)?.network });
}
