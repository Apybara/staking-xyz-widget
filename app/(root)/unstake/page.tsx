import type { Metadata } from "next";
import type { PageProps } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideUnstakePage } from "./_components/ClientSideUnstakePage";

export default async function Unstake({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "unstake");

  return <ClientSideUnstakePage searchParams={resolvedSearchParams} />;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Unstake", networkParam: (await searchParams)?.network });
}
