"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { UnstakingProvider } from "../../../_contexts/UnstakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { UnstakeAmountInputPad } from "./UnstakeAmountInputPad";
import { UnstakeInfoBox } from "./UnstakeInfoBox";
import { UnstakeSecondaryInfoBox } from "./UnstakeSecondaryInfoBox";
import { UnstakeCTA } from "./UnstakeCTA";
import { useUnstaking } from "@/app/_contexts/UnstakingContextV2";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";

export const ClientSideUnstakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const unstakingData = useUnstaking();

  return (
    <UnstakingProvider>
      <PageViewTop page="Unstake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        <UnstakeAmountInputPad />
        <UnstakeInfoBox />
        <UnstakeSecondaryInfoBox />
      </WidgetContent>
      <WidgetBottomBox>
        <UnstakeCTA />
      </WidgetBottomBox>

      <TxProcedureDialog data={unstakingData} type="unstake" dialog="unstakingProcedure" />
    </UnstakingProvider>
  );
};
