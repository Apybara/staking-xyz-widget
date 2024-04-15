import type { RouterStruct } from "../types";
import cn from "classnames";
import redirectPage from "../_actions/redirectPage";
import revalidatePageQueries from "../_actions/revalidatePageQueries";
import { DefaultViewTop } from "./_components/WidgetTop";
import { HeroCard } from "./_components/HeroCard";
import * as NavCard from "./_components/NavCard";
import { StakeNavCard } from "./_components/StakeNavCard";
import { UnstakeNavCard } from "./_components/UnstakeNavCard";
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
        <NavCard.Rewards
          searchParams={searchParams}
          disabled
          endBox={{
            title: <NavCard.SecondaryText>Rewards</NavCard.SecondaryText>,
            value: <NavCard.PrimaryText>00.00 %</NavCard.PrimaryText>,
          }}
        />
        <ActivityNavCard searchParams={searchParams} />
      </nav>
    </>
  );
}
