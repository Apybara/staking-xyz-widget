import type { Metadata } from "next";
import type { PageProps } from "../../../types";
import { PageViewTop } from "../../_components/WidgetTop";
import redirectPage from "../../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../../_utils/site";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { RewardsHistoryTable } from "../_components/HistoryTable";

export default async function Rewards({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "rewards/history");

  return (
    <>
      <PageViewTop page="Rewards history" homeURL={getLinkWithSearchParams(resolvedSearchParams, "rewards")} />
      <RewardsHistoryTable />
    </>
  );
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards history", networkParam: (await searchParams)?.network });
}
