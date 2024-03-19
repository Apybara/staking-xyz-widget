"use client";

import type { CurrencyOption } from ".";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWidget } from "../../_contexts/WidgetContext";

export const useCurrencyChange = () => {
  const { setStates } = useWidget();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (getIsCurrencyOption(current.get("currency") || "")) {
      setStates({ currency: current.get("currency") as CurrencyOption });
      return;
    }

    current.set("currency", "USD");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [searchParams]);

  const activeCurrency = useMemo(() => {
    const current = searchParams.get("currency") || "";
    return getIsCurrencyOption(current) ? current : "USD";
  }, [searchParams]);

  const onChange = (cur: CurrencyOption) => {
    setStates({ currency: cur });

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("currency", cur);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeCurrency,
    onChange,
  };
};

const getIsCurrencyOption = (arg: string): arg is CurrencyOption => {
  return ["USD", "EUR", "TIA"].includes(arg);
};
