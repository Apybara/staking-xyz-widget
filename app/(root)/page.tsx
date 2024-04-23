import type { Metadata } from "next";
import type { RouterStruct } from "../types";
import cn from "classnames";
import redirectPage from "../_actions/redirectPage";
import { getDynamicPageMetadata } from "../_utils/site";
import revalidatePageQueries from "../_actions/revalidatePageQueries";
import { DefaultViewTop } from "./_components/WidgetTop";
import { HeroCard } from "./_components/HeroCard";
import { StakeNavCard } from "./_components/StakeNavCard";
import { UnstakeNavCard } from "./_components/UnstakeNavCard";
import { RewardsNavCard } from "./_components/RewardsNavCard";
import { ActivityNavCard } from "./_components/ActivityNavCard";
import * as S from "./root.css";

export default async function Home({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "");
  await revalidatePageQueries(network);

  return (
    <>
      <DefaultViewTop />
      <HeroCard />
      <nav className={cn(S.nav)}>
        <StakeNavCard searchParams={searchParams} />
        <UnstakeNavCard searchParams={searchParams} />
        <RewardsNavCard searchParams={searchParams} />
        <ActivityNavCard searchParams={searchParams} />
      </nav>
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "", networkParam: searchParams?.network });
}
