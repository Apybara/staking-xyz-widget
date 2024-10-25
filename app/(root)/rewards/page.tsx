import type { Metadata } from "next";
import type { PageProps } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ClientSideRewardsPage } from "./_components/ClientSideRewardsPage";

export default async function Rewards({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "rewards");

  return <ClientSideRewardsPage searchParams={resolvedSearchParams} />;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards", networkParam: (await searchParams)?.network });
}
