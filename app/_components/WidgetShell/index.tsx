import type { ReactNode } from "react";
import cn from "classnames";
import * as S from "./widgetShell.css";

export type WidgetShellProps = {
  children: ReactNode;
};

export const WidgetShell = ({ children }: WidgetShellProps) => {
  return <section className={cn(S.shell)}>{children}</section>;
};
