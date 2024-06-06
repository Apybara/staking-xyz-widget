"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { useExternalDelegations } from "@/app/_services/stakingOperator/hooks";
import { RedelegatingProvider } from "@/app/_contexts/RedelegatingContext";
import { useDialog } from "@/app/_contexts/UIContext";
import { removeLeadingAndTrailingZeros } from "@/app/_utils";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { PageViewTop } from "../../_components/WidgetTop";
import { Icon } from "@/app/_components/Icon";
import { ImportHelpDialog } from "@/app/_components/ImportHelpDialog";
import { Skeleton } from "@/app/_components/Skeleton";
import Tooltip from "@/app/_components/Tooltip";
import { WidgetContent } from "@/app/_components/WidgetContent";
import { CTACard } from "../../_components/HeroCard/CTACard";
import { RedelegateInfoBox } from "./RedelegateInfoBox";
import { RedelegateAgreement } from "./RedelegateAgreement";
import { RedelegatingProcedureDialog } from "./RedelegatingProcedureDialog";

import * as S from "./redelegate.css";

export const ClientSideRedelegatePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  const { toggleOpen } = useDialog("importHelp");

  const { data, isLoading } = useExternalDelegations() || {};
  const { redelegationAmount } = data || {};
  const amountToImport = useDynamicAssetValueFromCoin({
    coinVal: redelegationAmount,
    minValue: 0.000001,
    formatOptions: { mantissa: 6 },
  });
  const formattedAmount = amountToImport ? removeLeadingAndTrailingZeros(amountToImport.split(" ")[0]) : 0;

  return (
    <RedelegatingProvider>
      <PageViewTop
        className={S.redelegateTop}
        page="Import"
        homeURL={getLinkWithSearchParams(searchParams, "")}
        endBox={
          <button className={S.helpButton} onClick={() => toggleOpen(true)}>
            <Icon name="question" size={16} />
          </button>
        }
      />
      <ImportHelpDialog />
      <WidgetContent>
        <CTACard
          topSubtitle={
            <>
              <span>Amount to import</span>
              <Tooltip
                className={S.unstakingTooltip}
                trigger={<Icon name="info" />}
                content="If you redelegated some positions within 21 days, the amount can't be imported."
              />
            </>
          }
          title={isLoading ? <Skeleton height={20} width={100} /> : formattedAmount}
        />
        <RedelegateInfoBox />
      </WidgetContent>
      <RedelegateAgreement />
      <RedelegatingProcedureDialog />
    </RedelegatingProvider>
  );
};
