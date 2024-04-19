import type { Metadata } from "next";
import type { RouterStruct } from "../../../types";
import { PageViewTop } from "../../_components/WidgetTop";
import redirectPage from "../../../_actions/redirectPage";
import revalidatePageQueries from "../../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../../_utils/site";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { RewardsHistoryTable } from "../_components/HistoryTable";

export default async function Rewards({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "rewards/history");
  await revalidatePageQueries(network);

  return (
    <>
      <PageViewTop page="Rewards history" homeURL={getLinkWithSearchParams(searchParams, "rewards")} />
      <RewardsHistoryTable />
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards history", networkParam: searchParams?.network });
}
