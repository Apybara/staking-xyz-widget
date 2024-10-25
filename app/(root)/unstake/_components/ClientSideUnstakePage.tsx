"use client";
import type { ExpectedSearchParams } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { UnstakingProvider } from "../../../_contexts/UnstakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { StakingTypeTabs } from "../../_components/StakingTypeTabs";
import { UnstakeAmountInputPad } from "./UnstakeAmountInputPad";
import { UnstakeInfoBox } from "./UnstakeInfoBox";
import { UnstakeSecondaryInfoBox } from "./UnstakeSecondaryInfoBox";
import { UnstakeCTA } from "./UnstakeCTA";
import { UnstakingProcedureDialog } from "./UnstakingProcedureDialog";
import { useShell } from "@/app/_contexts/ShellContext";

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: ExpectedSearchParams }) => {
  const { stakingType } = useShell();

  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        {!!stakingType && <StakingTypeTabs />}
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
