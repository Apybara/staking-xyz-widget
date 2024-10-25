import type { Metadata } from "next";
import type { PageProps } from "../../types";
import cn from "classnames";
import { PageViewTop } from "../_components/WidgetTop";
import { getLinkWithSearchParams } from "../../_utils/routes";
import redirectPage from "../../_actions/redirectPage";
import { getDynamicPageMetadata } from "../../_utils/site";
import { ActivityTable } from "./_components/ActivityTable";
import { WidgetContent } from "@/app/_components/WidgetContent";

import * as S from "./_components/activity.css";

export default async function Activity({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "activity");

  return (
    <>
      <PageViewTop page="Activity" homeURL={getLinkWithSearchParams(resolvedSearchParams, "")} />
      <WidgetContent className={cn({ [S.aleoActivityPage]: resolvedSearchParams.network === "aleo" })} variant="full">
        <ActivityTable />
      </WidgetContent>
    </>
  );
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "Activity", networkParam: (await searchParams)?.network });
}
