import type { Metadata } from "next";
import type { PageProps } from "../types";
import cn from "classnames";
import redirectPage from "../_actions/redirectPage";
import { getDynamicPageMetadata } from "../_utils/site";
import { DefaultViewTop } from "./_components/WidgetTop";
import { WidgetContent } from "../_components/WidgetContent";
import { HeroCard } from "./_components/HeroCard";
import { StakeNavCard } from "./_components/StakeNavCard";
import { UnstakeNavCard } from "./_components/UnstakeNavCard";
import { RewardsNavCard } from "./_components/RewardsNavCard";
import { ActivityNavCard } from "./_components/ActivityNavCard";
import * as S from "./root.css";

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  await redirectPage(resolvedSearchParams, "");

  return (
    <>
      <DefaultViewTop />
      <WidgetContent variant="full">
        <HeroCard />
        <nav className={cn(S.nav)}>
          <StakeNavCard searchParams={resolvedSearchParams} />
          <UnstakeNavCard searchParams={resolvedSearchParams} />
          <RewardsNavCard searchParams={resolvedSearchParams} />
          <ActivityNavCard searchParams={resolvedSearchParams} />
        </nav>
      </WidgetContent>
    </>
  );
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "", networkParam: (await searchParams)?.network });
}
