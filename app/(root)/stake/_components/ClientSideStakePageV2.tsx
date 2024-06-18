"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { StakeAmountInputPad } from "./StakeAmountInputPad";
import { StakeInfoBox } from "./StakeInfoBox";
import { StakeCTA } from "./StakeCTA";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { TxProcedureDialog } from "../../_components/TxProcedureDialog";
import { useStaking } from "@/app/_contexts/StakingContextV2";

export const ClientSideStakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const stakingData = useStaking();

  return (
    <StakingProvider>
      <PageViewTop page="Stake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <WidgetContent>
        <StakeAmountInputPad />
        <StakeInfoBox />
      </WidgetContent>
      <WidgetBottomBox>
        <StakeCTA />
      </WidgetBottomBox>

      <TxProcedureDialog data={stakingData} type="stake" dialog="stakingProcedure" />
    </StakingProvider>
  );
};
