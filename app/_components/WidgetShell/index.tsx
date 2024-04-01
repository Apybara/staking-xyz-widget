"use client";

import type { ReactNode } from "react";
import cn from "classnames";
import { useWidget } from "../../_contexts/WidgetContext";
import { LoadingSpinner } from "../LoadingSpinner";
import * as S from "./widgetShell.css";

export type WidgetShellProps = {
  className?: string;
  children: ReactNode;
};

export const WidgetShell = ({ children, className }: WidgetShellProps) => {
  const { status } = useWidget();

  if (status === "loading") {
    return <LoadingSpinner size={24} />;
  }
  return <section className={cn(S.shell, className)}>{children}</section>;
};
