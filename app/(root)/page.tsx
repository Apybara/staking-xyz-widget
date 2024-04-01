import type { RouterStruct } from "../types";
import cn from "classnames";
import redirectPage from "../_actions/redirectPage";
import revalidatePageQueries from "../_actions/revalidatePageQueries";
import { DefaultViewTop } from "./_components/WidgetTop";
import { WalletConnectionCardButton } from "./_components/WalletConnectionCardButton/index";
import * as NavCard from "./_components/NavCard";
import * as S from "./root.css";

export default async function Home({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "");
  await revalidatePageQueries(network);

  return (
    <>
      <DefaultViewTop />
      <WalletConnectionCardButton />
      <nav className={cn(S.nav)}>
        <NavCard.Stake searchParams={searchParams} />
        <NavCard.Unstake searchParams={searchParams} disabled />
        <NavCard.Rewards
          searchParams={searchParams}
          disabled
          endBox={{
            title: <NavCard.SecondaryText>Rewards</NavCard.SecondaryText>,
            value: <NavCard.PrimaryText>00.00 %</NavCard.PrimaryText>,
          }}
        />
        <NavCard.Activity searchParams={searchParams} disabled />
      </nav>
    </>
  );
}
