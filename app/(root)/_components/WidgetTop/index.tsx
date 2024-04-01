import cn from "classnames";
import { Icon } from "../../../_components/Icon";
import * as S from "./widgetTop.css";

export const WidgetTop = () => {
  return (
    <div className={cn(S.widgetTop)}>
      <button className={cn(S.widgetTopButton)}>
        <Icon name="refresh" size={16} />
      </button>
      <button className={cn(S.widgetTopButton)}>
        <Icon name="menu" size={16} />
      </button>
    </div>
  );
};
