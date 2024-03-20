"use client";

import type { Currency, Network } from "../../types";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWidget } from "../../_contexts/WidgetContext";
import { networkDenom } from "../../consts";

export const useNetworkChange = () => {
  const { setStates } = useWidget();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (getIsNetworkOption(current.get("network") || "")) {
      setStates({ network: current.get("network") as Network });
      return;
    }

    current.set("network", "celestia");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [searchParams]);

  const activeNetwork = useMemo(() => {
    const current = searchParams.get("network") || "";
    return getIsNetworkOption(current) ? current : "celestia";
  }, [searchParams]);

  const onChange = (net: Network) => {
    setStates({ network: net });

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("network", net);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeNetwork,
    onChange,
  };
};

export const useCurrencyChange = () => {
  const { network, setStates } = useWidget();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (getIsCurrencyOption(current.get("currency") || "", network && networkDenom[network])) {
      setStates({ currency: current.get("currency") as Currency });
      return;
    }

    current.set("currency", "USD");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [searchParams]);

  const activeCurrency = useMemo(() => {
    const current = searchParams.get("currency") || "";
    return getIsCurrencyOption(current, network && networkDenom[network]) ? current : "USD";
  }, [searchParams]);

  const onChange = (cur: Currency) => {
    setStates({ currency: cur });

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("currency", cur);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeCurrency,
    activeNetworkDenom: network && networkDenom[network],
    onChange,
  };
};

const getIsCurrencyOption = (arg: string, activeNetworkDenom: string | null): arg is Currency => {
  if (!activeNetworkDenom) return ["USD", "EUR"].includes(arg);
  return ["USD", "EUR", activeNetworkDenom].includes(arg);
};

const getIsNetworkOption = (arg: string): arg is Network => ["celestia", "mocha-4"].includes(arg);
