"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { UnstakingProvider } from "../../../_contexts/UnstakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { UnstakeAmountInputPad } from "./UnstakeAmountInputPad";
import { UnstakeInfoBox } from "./UnstakeInfoBox";
import { UnstakeSecondaryInfoBox } from "./UnstakeSecondaryInfoBox";
import { UnstakeCTA } from "./UnstakeCTA";
import { UnstakingProcedureDialog } from "./UnstakingProcedureDialog";
import { bottomBox } from "./unstake.css";

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <UnstakeAmountInputPad />
      <UnstakeInfoBox />
      <UnstakeSecondaryInfoBox />
      <div className={bottomBox}>
        <UnstakeCTA />
      </div>
      <UnstakingProcedureDialog />
    </UnstakingProvider>
  );
};
