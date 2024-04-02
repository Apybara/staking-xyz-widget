import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { ClientSideStakePage } from "./_components/ClientSideStakePage";

export default async function Stake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "stake");
  await revalidatePageQueries(network);

  return <ClientSideStakePage searchParams={searchParams} />;
}

export const metadata: Metadata = {
  title: "Stake | Staking.xyz",
  description: "Your portal to staking",
};
