"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "../../../_components/Icon";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import * as S from "./widgetTop.css";

export const DefaultViewTop = () => {
  const queryClient = useQueryClient();
  const [isRefetching, setIsRefetching] = useState(false);

  const moreLink = useLinkWithSearchParams("more");
  const importLink = useLinkWithSearchParams("import");

  const refetch = async () => {
    setIsRefetching(true);
    await queryClient.resetQueries();
    setIsRefetching(false);
  };

  return (
    <div className={cn(S.defaultTop)}>
      <Link href={importLink} className={S.importButton}>
        <Icon name="download" />
        <span>Import my stake</span>
      </Link>
      <div className={S.buttonContainer}>
        <button className={cn(S.button({ state: isRefetching ? "fetching" : "default" }))} onClick={refetch}>
          <Icon name="rotate" size={20} />
        </button>
        <Link href={moreLink} className={S.button()}>
          <Icon name="menu" size={20} />
        </Link>
      </div>
    </div>
  );
};

export const PageViewTop = ({ page, homeURL, endBox }: { page: string; homeURL: string; endBox?: ReactNode }) => {
  return (
    <div className={cn(S.pageTop)}>
      <Link href={homeURL} className={S.button()}>
        <Icon name="cross" size={20} />
      </Link>
      <h1 className={cn(S.title)}>{page}</h1>
      {!!endBox && endBox}
    </div>
  );
};
