"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { LiquidStakingCredits } from "@/app/(root)/_components/LiquidStakingCredits";

import { useWidget } from "../../_contexts/WidgetContext";
import { LoadingSpinner } from "../LoadingSpinner";
import { PendingTransactionsCapsule } from "../PendingTransactionsCapsule";
import * as S from "./widgetShell.css";

export type WidgetShellProps = {
  className?: string;
  children: ReactNode;
};

export const WidgetShell = ({ children, className }: WidgetShellProps) => {
  const { status } = useWidget();
  const searchParams = useSearchParams();
  const stakingType = searchParams.get("stakingType");

  if (status === "loading") {
    return <LoadingSpinner size={24} />;
  }

  return (
    <>
      <section className={cn(S.shell, className)}>{children}</section>
      {stakingType === "liquid" && <LiquidStakingCredits />}
      <PendingTransactionsCapsule />
    </>
  );
};
