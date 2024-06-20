"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { PageViewTop } from "../../_components/WidgetTop";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";
import { RewardsSummary } from "./RewardsSummary";
import { useShell } from "@/app/_contexts/ShellContext";
import { useWallet } from "@/app/_contexts/WalletContext";
import { useCosmosSigningClient } from "@/app/_services/cosmos/hooks";
import { useClaimingProcedures } from "@/app/_services/rewards/hooks";
import { defaultNetwork } from "@/app/consts";

export const ClientSideRewardsPage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { network: shellNetwork } = useShell();
  const { activeWallet, address } = useWallet();
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: shellNetwork || defaultNetwork,
    wallet: activeWallet,
  });
  const claimingData = useClaimingProcedures({
    address: address,
    network: shellNetwork || defaultNetwork,
    cosmosSigningClient,
  });

  return (
    <>
      <PageViewTop page="Rewards" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <RewardsSummary />

      <TxProcedureDialog data={claimingData} type="claim" dialog="claimingProcedure" />
    </>
  );
};
