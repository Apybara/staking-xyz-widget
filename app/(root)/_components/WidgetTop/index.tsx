import cn from "classnames";
import Link from "next/link";
import { Icon } from "../../../_components/Icon";
import * as S from "./widgetTop.css";

export const DefaultViewTop = () => {
  return (
    <div className={cn(S.defaultTop)}>
      <button className={cn(S.button)}>
        <Icon name="rotate" size={20} />
      </button>
      <button className={cn(S.button)}>
        <Icon name="menu" size={20} />
      </button>
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
