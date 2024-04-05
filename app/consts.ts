import type { Network, NetworkInfo, NetworkCurrency, WalletInfo, WalletType } from "./types";

export const NetworkVariants = ["celestia", "celestiatestnet3"] as const;
export const networkVariants = [...NetworkVariants];

export const CoinVariants = ["TIA"] as const;
export const coinVariants = [...CoinVariants];

export const networkCurrency: Record<Network, NetworkCurrency> = {
  celestia: "TIA",
  celestiatestnet3: "TIA",
};
export const networkCoinPriceSymbol: Record<Network, string> = {
  celestia: "celestia",
  celestiatestnet3: "celestia",
};
export const networkRegex = /\b(celestia|celestiatestnet3)\b/;

export const networkInfo: Record<Network, NetworkInfo> = {
  celestia: {
    id: "celestia",
    name: "Celesita",
    logo: "/networks/celestia-logo.svg",
    currency: networkCurrency.celestia,
    denom: "u" + networkCurrency.celestia.toLowerCase(),
  },
  celestiatestnet3: {
    id: "celestiatestnet3",
    name: "Celestia Testnet",
    logo: "/networks/celestia-logo.svg",
    currency: networkCurrency.celestiatestnet3,
    denom: "u" + networkCurrency.celestiatestnet3.toLowerCase(),
  },
};

export const networkDefaultGasPrice: Record<Network, number> = {
  celestia: 0.02,
  celestiatestnet3: 0.02,
};

export const networkExplorer: Record<Network, string> = {
  celestia: "https://www.mintscan.io/celestia/",
  celestiatestnet3: "https://www.mintscan.io/celestia-testnet/",
};

export const CosmosNetworkVariants = ["celestia", "celestiatestnet3"] as const;
export const cosmosNetworkVariants = [...CosmosNetworkVariants];

export const networkWalletPrefixes: Record<Network, string> = {
  celestia: "celestia1",
  celestiatestnet3: "celestia1",
};

export const networkEndpoints: Record<
  Network,
  {
    rpc: string;
    rest: string;
  }
> = {
  celestia: {
    rpc: process.env.NEXT_PUBLIC_CELESTIA_RPC_ENDPOINT || "https://rpc.lunaroasis.net/",
    rest: process.env.NEXT_PUBLIC_CELESTIA_REST_ENDPOINT || "https://api.lunaroasis.net/",
  },
  celestiatestnet3: {
    rpc: process.env.NEXT_PUBLIC_CELESTIATESTNET3_RPC_ENDPOINT || "https://rpc-mocha.pops.one/",
    rest: process.env.NEXT_PUBLIC_CELESTIATESTNET3_REST_ENDPOINT || "https://api-mocha.pops.one/",
  },
};

export const FiatCurrencyVariants = ["USD", "EUR"] as const;
export const fiatCurrencyVariants = [...FiatCurrencyVariants];

export const currencyRegex = /\b(usd|eur|tia)\b/i;
export const fiatCurrencyMap = {
  USD: "$",
  EUR: "€",
};

export const CosmosWalletVariants = ["keplr", "keplrMobile", "leap", "leapMobile", "okx", "walletConnect"] as const;
export const cosmosWalletVariants = [...CosmosWalletVariants];

export const WalletVariants = [...cosmosWalletVariants] as const;
export const walletVariants = [...WalletVariants];

export const networkWalletVariants: Record<Network, Array<string>> = {
  celestia: cosmosWalletVariants,
  celestiatestnet3: cosmosWalletVariants,
};

export const walletsInfo: Record<WalletType, WalletInfo> = {
  keplr: {
    id: "keplr",
    name: "Keplr",
    logo: "/wallets/keplr.svg",
    downloadLink: "https://www.keplr.app/download",
    devicesSupport: ["desktop"],
  },
  keplrMobile: {
    id: "keplrMobile",
    name: "Keplr mobile",
    logo: "/wallets/keplr.svg",
    downloadLink: undefined,
    devicesSupport: ["mobile"],
  },
  leap: {
    id: "leap",
    name: "Leap",
    logo: "/wallets/leap.svg",
    downloadLink: "https://www.leapwallet.io/download",
    devicesSupport: ["desktop"],
  },
  leapMobile: {
    id: "leapMobile",
    name: "Leap mobile",
    logo: "/wallets/leap.svg",
    downloadLink: undefined,
    devicesSupport: ["mobile"],
  },
  okx: {
    id: "okx",
    name: "OKX wallet",
    logo: "/wallets/okx.svg",
    downloadLink: "https://www.okx.com/download",
    devicesSupport: ["desktop"],
  },
  walletConnect: {
    id: "walletConnect",
    name: "WalletConnect",
    logo: "/wallets/wc.svg",
    downloadLink: undefined,
    devicesSupport: ["desktop"],
  },
};
export const networkWalletInfos: Record<Network, Array<WalletInfo>> = {
  celestia: [
    walletsInfo.keplr,
    walletsInfo.leap,
    walletsInfo.okx,
    walletsInfo.keplrMobile,
    walletsInfo.leapMobile,
    walletsInfo.walletConnect,
  ],
  celestiatestnet3: [walletsInfo.keplr, walletsInfo.leap, walletsInfo.keplrMobile, walletsInfo.leapMobile],
};

export const ConnectorVariants = ["cosmosKit"] as const;
export const connectorVariants = [...ConnectorVariants];

export const feeRatioByNetwork: Record<Network, number> = {
  celestia:
    process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE && !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE)
      : 0.3,
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE && !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE)
      : 0.3,
};

export const unstakingPeriodByNetwork: Record<Network, string> = {
  celestia: "21 days",
  celestiatestnet3: "21 days",
};

export const SITE_TITLE = "Staking.xyz";
export const SITE_DESCRIPTION = "Your portal to staking";
export const SITE_URL = "https://staking.xyz";
export const SITE_IMAGE = "/og-image.png";
