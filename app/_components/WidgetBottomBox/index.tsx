import type { ReactNode } from "react";

import * as S from "./widgetBottomBox.css";

export type WidgetBottomBoxProps = {
  children: ReactNode;
};

export const WidgetBottomBox = ({ children }: WidgetBottomBoxProps) => {
  return <div className={S.widgetBottomBox}>{children}</div>;
};
