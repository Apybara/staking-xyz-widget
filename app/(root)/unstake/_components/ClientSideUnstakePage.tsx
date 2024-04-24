"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { UnstakingProvider } from "../../../_contexts/UnstakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { UnstakeAmountInputPad } from "./UnstakeAmountInputPad";
import { UnstakeInfoBox } from "./UnstakeInfoBox";
import { UnstakeSecondaryInfoBox } from "./UnstakeSecondaryInfoBox";
import { UnstakeCTA } from "./UnstakeCTA";
import { UnstakingProcedureDialog } from "./UnstakingProcedureDialog";

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <UnstakeAmountInputPad />
      <UnstakeInfoBox />
      <UnstakeSecondaryInfoBox />
      <WidgetBottomBox>
        <UnstakeCTA />
      </WidgetBottomBox>
      <UnstakingProcedureDialog />
    </UnstakingProvider>
  );
};
