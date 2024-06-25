"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { StakingTypeTabs } from "../../_components/StakingTypeTabs";
import { StakeAmountInputPad } from "./StakeAmountInputPad";
import { StakeInfoBox } from "./StakeInfoBox";
import { StakeCTA } from "./StakeCTA";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { StakingProcedureDialog } from "./StakingProcedureDialog";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";

export const ClientSideStakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { network } = useShell();
  const isAleoNetwork = network && getIsAleoNetwork(network);

  return (
    <StakingProvider>
      <PageViewTop page="Stake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        {isAleoNetwork && <StakingTypeTabs />}
        <StakeAmountInputPad />
        <StakeInfoBox />
      </WidgetContent>
      <WidgetBottomBox>
        <StakeCTA />
      </WidgetBottomBox>

      <StakingProcedureDialog />
    </StakingProvider>
  );
};
