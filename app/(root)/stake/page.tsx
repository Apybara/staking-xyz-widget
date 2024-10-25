import type { Metadata } from "next";
import type { PageProps } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideStakePage } from "./_components/ClientSideStakePage";

export default async function Stake({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "stake");

  return <ClientSideStakePage searchParams={resolvedSearchParams} />;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Stake", networkParam: (await searchParams)?.network });
}
