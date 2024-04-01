import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { getLinkWithSearchParams } from "../../_utils/routes";
import { PageViewTop } from "../_components/WidgetTop";

export default async function Stake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "stake");
  await revalidatePageQueries(network);

  return (
    <>
      <PageViewTop page="Stake" homeURL={getLinkWithSearchParams(searchParams, "")} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Stake | Staking.xyz",
  description: "Your portal to staking",
};
