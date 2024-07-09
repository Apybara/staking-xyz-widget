import type { Currency, Network, NetworkCurrency, StakingType } from "../../types";
import type { ShellContext } from "./types";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShell } from "../../_contexts/ShellContext";
import {
  networkCurrency,
  networkUrlParamRegex,
  networkIdToUrlParamAlias,
  networkUrlParamToId,
  currencyRegex,
  defaultGlobalCurrency,
  defaultNetwork,
  CoinVariants,
  stakingTypeRegex,
  networkDefaultStakingType,
} from "../../consts";

export const useActiveNetwork = ({ setStates }: { setStates: ShellContext["setStates"] }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const network = searchParams.get("network");
    if (!network || !networkUrlParamRegex.test(network)) {
      // The redirect operation is handled in the page component
      return;
    }
    setStates({ network: networkUrlParamToId[network] as Network });
  }, [searchParams]);

  return null;
};

export const useNetworkChange = () => {
  const { network } = useShell();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { onUpdateRouter: onStakingTypeUpdate } = useStakingTypeChange();

  const onUpdateRouter = (net: Network) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const activeCurrency = current.get("currency");
    const stakingType = networkDefaultStakingType[net || defaultNetwork];

    current.set("network", networkIdToUrlParamAlias[net]);

    stakingType && current.set("stakingType", stakingType);
    onStakingTypeUpdate(stakingType);

    if (CoinVariants.includes(activeCurrency as NetworkCurrency)) {
      // activate currency when network is changed and the previous active currency is not FIAT
      current.set("currency", networkCurrency[net]);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeNetwork: network || defaultNetwork,
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
    activeCurrency: currency || defaultGlobalCurrency,
    activeNetworkCurrency: network && networkCurrency[network],
    onUpdateRouter,
  };
};

export const useActiveStakingType = ({ setStates }: { setStates: ShellContext["setStates"] }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const stakingType = searchParams.get("stakingType") as StakingType;
    const isStakingTypeValid = stakingType && stakingTypeRegex.test(stakingType);

    setStates({ stakingType: isStakingTypeValid ? stakingType : null });
  }, [searchParams]);

  return null;
};

export const useStakingTypeChange = () => {
  const { stakingType, network } = useShell();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultStakingType = networkDefaultStakingType[network || defaultNetwork];

  const onUpdateRouter = (stakingT: StakingType | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    stakingT && current.set("stakingType", stakingT);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeStakingType: stakingType || defaultStakingType,
    onUpdateRouter,
  };
};

export const useActiveValidator = ({ setStates }: { setStates: ShellContext["setStates"] }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const validator = searchParams.get("validator");
    setStates({ validator });
  }, [searchParams]);

  return null;
};

export const useValidatorChange = () => {
  const { validator } = useShell();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onUpdateRouter = (val: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (val) {
      current.set("validator", val);
    } else {
      current.delete("validator");
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return {
    activeValidator: validator,
    onUpdateRouter,
  };
};
