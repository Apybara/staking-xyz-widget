import type { ReactNode } from "react";
import cn from "classnames";
import { primaryAvailabilityText, secondaryAvailabilityText } from "./amountInputPad.css";

export const Primary = ({ children }: { children: ReactNode }) => {
  return <span className={cn(primaryAvailabilityText)}>{children}</span>;
};

export const Secondary = ({ children }: { children: ReactNode }) => {
  return <span className={cn(secondaryAvailabilityText)}>{children}</span>;
};
