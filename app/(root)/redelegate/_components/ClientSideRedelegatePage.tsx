"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { RedelegatingProvider } from "@/app/_contexts/RedelegatingContext";
import { useDialog } from "@/app/_contexts/UIContext";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { PageViewTop } from "../../_components/WidgetTop";
import { Icon } from "@/app/_components/Icon";
import { ImportHelpDialog } from "@/app/_components/ImportHelpDialog";
import { CTACard } from "../../_components/HeroCard/CTACard";
import { RedelegateInfoBox } from "./RedelegateInfoBox";
import { RedelegateAgreement } from "./RedelegateAgreement";

import * as S from "./redelegate.css";

export const ClientSideRedelegatePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { toggleOpen } = useDialog("importHelp");

  const amountToImport = useDynamicAssetValueFromCoin({ coinVal: 1000 });

  return (
    <RedelegatingProvider>
      <PageViewTop
        className={S.redelegateTop}
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
      <RedelegateInfoBox />
      <RedelegateAgreement />
    </RedelegatingProvider>
  );
};
