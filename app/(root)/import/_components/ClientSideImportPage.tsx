"use client";
import { useState } from "react";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { useDialog } from "@/app/_contexts/UIContext";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { PageViewTop } from "../../_components/WidgetTop";
import { Icon } from "@/app/_components/Icon";
import { ImportHelpDialog } from "@/app/_components/ImportHelpDialog";
import { CTACard } from "../../_components/HeroCard/CTACard";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { Checkbox } from "@/app/_components/Checkbox";
import { ImportInfoBox } from "./ImportInfoBox";

import * as S from "./import.css";
import { CTAButton } from "@/app/_components/CTAButton";

export const ClientSideImportPage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { toggleOpen } = useDialog("importHelp");
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const amountToImport = useDynamicAssetValueFromCoin({ coinVal: 1000 });

  return (
    <StakingProvider>
      <PageViewTop
        className={S.importTop}
        page="Import"
        homeURL={getLinkWithSearchParams(searchParams, "")}
        endBox={
          <button className={S.helpButton} onClick={() => toggleOpen(true)}>
            <Icon name="question" size={20} />
          </button>
        }
      />
      <ImportHelpDialog />

      <CTACard topSubtitle="Amount to import" title={amountToImport} />
      <ImportInfoBox />
      <WidgetBottomBox>
        <Checkbox
          checked={isAgreementChecked}
          onChange={({ target }) => setIsAgreementChecked(target.checked)}
          label="Agree to import all my stakes"
        />
        <CTAButton
          state={isAgreementChecked ? "default" : "disabled"}
          variant={isAgreementChecked ? "primary" : "tertiary"}
        >
          {isAgreementChecked ? "Import my stake" : "Agree"}
        </CTAButton>
      </WidgetBottomBox>
    </StakingProvider>
  );
};
