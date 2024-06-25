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

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        <StakingTypeTabs />
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
