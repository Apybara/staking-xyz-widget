"use client";

import type { ReactNode } from "react";
import { GrazProvider } from "./Graz";

export const WidgetProviders = ({ children }: { children: ReactNode }) => {
  return <GrazProvider>{children}</GrazProvider>;
};
