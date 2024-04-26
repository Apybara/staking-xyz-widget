import type { ReactNode } from "react";
import cn from "classnames";

import * as S from "./widgetBottomBox.css";

export type WidgetBottomBoxProps = {
  className?: string;
  children: ReactNode;
};

export const WidgetBottomBox = ({ className, children }: WidgetBottomBoxProps) => {
  return <div className={cn(className, S.widgetBottomBox)}>{children}</div>;
};
