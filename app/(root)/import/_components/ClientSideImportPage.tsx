"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { StakeAmountInputPad } from "./StakeAmountInputPad";
import { StakeInfoBox } from "./StakeInfoBox";
import { StakingProcedureDialog } from "./StakingProcedureDialog";
import { StakeCTA } from "./StakeCTA";
import { bottomBox } from "./stake.css";
import { Icon } from "@/app/_components/Icon";

export const ClientSideImportPage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <StakingProvider>
      <PageViewTop
        page="Import"
        homeURL={getLinkWithSearchParams(searchParams, "")}
        endBox={
          <button>
            <Icon name="question" />
          </button>
        }
      />
      <StakeAmountInputPad />
      <StakeInfoBox />
      <div className={bottomBox}>
        <StakeCTA />
      </div>
      <StakingProcedureDialog />
    </StakingProvider>
  );
};
