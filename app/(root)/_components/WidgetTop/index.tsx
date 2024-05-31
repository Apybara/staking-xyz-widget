"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import Link from "next/link";
import { useShell } from "@/app/_contexts/ShellContext";
import { useExternalDelegations } from "@/app/_services/stakingOperator/hooks";
import { Icon } from "../../../_components/Icon";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import * as S from "./widgetTop.css";

export const DefaultViewTop = () => {
  const queryClient = useQueryClient();
  const [isRefetching, setIsRefetching] = useState(false);

  const moreLink = useLinkWithSearchParams("more");
  const redelegateLink = useLinkWithSearchParams("redelegate");

  const externalDelegations = useExternalDelegations();
  const { redelegationAmount } = externalDelegations?.data || {};

  const refetch = async () => {
    setIsRefetching(true);
    await queryClient.resetQueries();
    setIsRefetching(false);
  };

  return (
    <div className={cn(S.defaultTop)}>
      <Link
        href={redelegateLink}
        className={cn(S.redelegateButton({ state: redelegationAmount ? "default" : "disabled" }))}
      >
        <Icon name="download" />
        <span>Import my stake</span>
      </Link>
      <div className={S.buttonContainer}>
        <button className={cn(S.button({ state: isRefetching ? "fetching" : "default" }))} onClick={refetch}>
          <Icon name="rotate" size={20} />
        </button>
        <Link href={moreLink} className={cn(S.button())}>
          <Icon name="menu" size={20} />
        </Link>
      </div>
    </div>
  );
};

export const PageViewTop = ({
  className,
  page,
  homeURL,
  endBox,
}: {
  className?: string;
  page: string;
  homeURL: string;
  endBox?: ReactNode;
}) => {
  const { isScrollActive } = useShell();

  return (
    <div className={cn(S.pageTop, { [S.pageTopFixed]: isScrollActive })}>
      <Link href={homeURL} className={cn(S.button())}>
        <Icon name="cross" size={20} />
      </Link>
      <h1 className={cn(S.title)}>{page}</h1>
      {!!endBox && endBox}
    </div>
  );
};
