import type { Currency, Network } from "../../types";
import type { ShellContext } from "./types";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShell } from "../../_contexts/ShellContext";
import { networkDenom, networkRegex, currencyRegex } from "../../consts";

export const useActiveNetwork = ({ setStates }: { setStates: ShellContext["setStates"] }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const network = searchParams.get("network");
    if (!network || !networkRegex.test(network)) {
      // The redirect operation is handled in the page component
      return;
    }

    setStates({ network: network as Network });
  }, [searchParams]);

  return null;
};

export const useNetworkChange = () => {
  const { network } = useShell();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onUpdateRouter = (net: Network) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("network", net);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeNetwork: network || "celestia",
    onUpdateRouter,
  };
};

export const useActiveCurrency = ({ setStates }: { setStates: ShellContext["setStates"] }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const currency = searchParams.get("currency");
    if (!currency || !currencyRegex.test(currency)) {
      // The redirect operation is handled in the page component
      return;
    }
    setStates({ currency: currency.toUpperCase() as Currency });
  }, [searchParams]);

  return null;
};

export const useCurrencyChange = () => {
  const { network, currency } = useShell();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onUpdateRouter = (curr: Currency) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("currency", curr);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeCurrency: currency || "USD",
    activeNetworkDenom: network && networkDenom[network],
    onUpdateRouter,
  };
};
