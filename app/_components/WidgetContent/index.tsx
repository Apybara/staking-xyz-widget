"use client";

import { useEffect, useRef, type ReactNode } from "react";
import cn from "classnames";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useShell } from "@/app/_contexts/ShellContext";

import * as S from "./widgetContent.css";

export type WidgetContentProps = {
  className?: string;
  variant?: "default" | "full";
  children: ReactNode;
};

export const WidgetContent = ({ className, variant = "default", children }: WidgetContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setStates } = useShell();

  const setScrollActive = () => {
    setStates({ isScrollActive: !!ref.current?.scrollTop });
  };

  useEffect(() => {
    setStates({ isScrollActive: false });

    if (ref.current) {
      ref.current.addEventListener("scroll", setScrollActive);

      return () => {
        ref.current?.removeEventListener("scroll", setScrollActive);
      };
    }
  }, [ref.current]);

  return (
    <ScrollArea.Root className={cn(S.widgetContent, { [S.widgetContentFull]: variant === "full" })} scrollHideDelay={0}>
      <ScrollArea.Viewport ref={ref} className={cn(className, S.widgetWrapper)}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={S.scrollbar} orientation="vertical">
        <ScrollArea.Thumb className={S.thumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={S.corner} />
    </ScrollArea.Root>
  );
};
