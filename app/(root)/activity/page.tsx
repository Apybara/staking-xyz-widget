import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import { PageViewTop } from "../_components/WidgetTop";
import { getLinkWithSearchParams } from "../../_utils/routes";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { ActivityTable } from "./_components/ActivityTable";

export default async function Activity({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "Activity");
  await revalidatePageQueries(network);

  return (
    <>
      <PageViewTop page="Activity" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <ActivityTable />
    </>
  );
}

export const metadata: Metadata = {
  title: "Activity | Staking.xyz",
  description: "Your portal to staking",
};
