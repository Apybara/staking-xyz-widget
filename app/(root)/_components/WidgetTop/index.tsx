"use client";
import cn from "classnames";
import Link from "next/link";
import { Icon } from "../../../_components/Icon";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import * as S from "./widgetTop.css";

export const DefaultViewTop = () => {
  const moreLink = useLinkWithSearchParams("more");

  return (
    <div className={cn(S.defaultTop)}>
      <button className={cn(S.button)}>
        <Icon name="rotate" size={20} />
      </button>
      <Link href={moreLink} className={S.link}>
        <button className={cn(S.button)}>
          <Icon name="menu" size={20} />
        </button>
      </Link>
    </div>
  );
};

export const PageViewTop = ({ page, homeURL }: { page: string; homeURL: string }) => {
  return (
    <div className={cn(S.pageTop)}>
      <Link href={homeURL} className={cn(S.button)}>
        <Icon name="cross" size={20} />
      </Link>
      <h1 className={cn(S.title)}>{page}</h1>
    </div>
  );
};
