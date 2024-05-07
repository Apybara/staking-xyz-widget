"use client";

import { useEffect, useRef, type ReactNode } from "react";
import cn from "classnames";

import * as S from "./widgetContent.css";
import { useShell } from "@/app/_contexts/ShellContext";

export type WidgetContentProps = {
  variant?: "default" | "full";
  children: ReactNode;
};

export const WidgetContent = ({ variant = "default", children }: WidgetContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setStates } = useShell();

  const setScrollActive = () => {
    setStates({ isScrollActive: !!ref.current?.scrollTop });
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("scroll", setScrollActive);

      return () => {
        ref.current?.removeEventListener("scroll", setScrollActive);
      };
    }
  }, [ref.current]);

  return (
    <div ref={ref} className={cn(S.widgetContent({ state: variant }))}>
      {children}
    </div>
  );
};
