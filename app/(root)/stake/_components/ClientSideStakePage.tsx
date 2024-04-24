"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { StakeAmountInputPad } from "./StakeAmountInputPad";
import { StakeInfoBox } from "./StakeInfoBox";
import { StakingProcedureDialog } from "./StakingProcedureDialog";
import { StakeCTA } from "./StakeCTA";

export const ClientSideStakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <StakingProvider>
      <PageViewTop page="Stake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <StakeAmountInputPad />
      <StakeInfoBox />
      <WidgetBottomBox>
        <StakeCTA />
      </WidgetBottomBox>
      <StakingProcedureDialog />
    </StakingProvider>
  );
};
