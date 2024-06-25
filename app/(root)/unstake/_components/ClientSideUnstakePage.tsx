"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { UnstakingProvider } from "../../../_contexts/UnstakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { StakingTypeTabs } from "../../_components/StakingTabs";
import { UnstakeAmountInputPad } from "./UnstakeAmountInputPad";
import { UnstakeInfoBox } from "./UnstakeInfoBox";
import { UnstakeSecondaryInfoBox } from "./UnstakeSecondaryInfoBox";
import { UnstakeCTA } from "./UnstakeCTA";
import { UnstakingProcedureDialog } from "./UnstakingProcedureDialog";
import { useShell } from "@/app/_contexts/ShellContext";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { network } = useShell();
  const isAleoNetwork = network && getIsAleoNetwork(network);

  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        {isAleoNetwork && <StakingTypeTabs />}
        <UnstakeAmountInputPad />
        <UnstakeInfoBox />
        <UnstakeSecondaryInfoBox />
      </WidgetContent>
      <WidgetBottomBox>
        <UnstakeCTA />
      </WidgetBottomBox>

      <UnstakingProcedureDialog />
    </UnstakingProvider>
  );
};
