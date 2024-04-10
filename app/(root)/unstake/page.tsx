import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import redirectPage from "../../_actions/redirectPage";
import revalidatePageQueries from "../../_actions/revalidatePageQueries";
import { ClientSideUnstakePage } from "./_components/ClientSideUnstakePage";

export default async function Unstake({ searchParams }: RouterStruct) {
  const { network } = searchParams || {};
  await redirectPage(searchParams, "unstake");
  await revalidatePageQueries(network);

  return <ClientSideUnstakePage searchParams={searchParams} />;
}

export const metadata: Metadata = {
  title: "Unstake | Staking.xyz",
  description: "Your portal to staking",
};
