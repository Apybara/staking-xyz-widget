import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import { PageViewTop } from "../_components/WidgetTop";
import { getLinkWithSearchParams } from "../../_utils/routes";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ActivityTable } from "./_components/ActivityTable";
import { WidgetContent } from "@/app/_components/WidgetContent";

import * as S from "./_components/activity.css";

export default async function Activity({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "activity");
  await revalidatePageQueries(network);

  return (
    <>
      <PageViewTop page="Activity" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent variant="full" className={S.container}>
        <ActivityTable />
      </WidgetContent>
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Activity", networkParam: searchParams?.network });
}
