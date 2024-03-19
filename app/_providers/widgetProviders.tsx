"use client";

import type { ReactNode } from "react";
import { GrazProvider } from "./Graz";
import { WidgetProvider } from "../_contexts/WidgetContext";

export const WidgetProviders = ({ children }: { children: ReactNode }) => {
  return (
    <WidgetProvider>
      <GrazProvider>{children}</GrazProvider>
    </WidgetProvider>
  );
};
