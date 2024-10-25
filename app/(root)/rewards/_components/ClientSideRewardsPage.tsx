"use client";
import type { ExpectedSearchParams } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { PageViewTop } from "../../_components/WidgetTop";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";
import { RewardsSummary } from "./RewardsSummary";
import { useShell } from "@/app/_contexts/ShellContext";
import { useWallet } from "@/app/_contexts/WalletContext";
import { useClaimingProcedures } from "@/app/_services/rewards/hooks";
import { defaultNetwork } from "@/app/consts";

export const ClientSideRewardsPage = ({ searchParams }: { searchParams: ExpectedSearchParams }) => {
  const { network: shellNetwork } = useShell();
  const { activeWallet, address } = useWallet();
  const claimingData = useClaimingProcedures({
    address: address,
    network: shellNetwork || defaultNetwork,
    wallet: activeWallet,
  });

  return (
    <>
      <PageViewTop page="Rewards" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <RewardsSummary />

      <TxProcedureDialog data={claimingData} type="claim" dialog="claimingProcedure" />
    </>
  );
};
