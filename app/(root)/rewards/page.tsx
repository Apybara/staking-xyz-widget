import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import { PageViewTop } from "../_components/WidgetTop";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { getLinkWithSearchParams } from "../../_utils/routes";
import { RewardsSummary } from "./_components/RewardsSummary";

export default async function Rewards({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "rewards");
  await revalidatePageQueries(network);

  return (
    <>
      <PageViewTop page="Rewards" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <RewardsSummary />
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Rewards", networkParam: searchParams?.network });
}
