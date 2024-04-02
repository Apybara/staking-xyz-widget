"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { StakeAmountInputPad } from "./StakeAmountInputPad";
import { StakeInfoBox } from "./StakeInfoBox";

export const ClientSideStakePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <StakingProvider>
      <PageViewTop page="Stake" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <StakeAmountInputPad />
      <StakeInfoBox />
    </StakingProvider>
  );
};
