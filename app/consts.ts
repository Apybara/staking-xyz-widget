import type { Network, NetworkInfo, NetworkDenom, WalletInfo, WalletType } from "./types";

export const NetworkVariants = ["celestia", "celestiatestnet3"] as const;
export const networkVariants = [...NetworkVariants];

export const NetworkDenomVariants = ["TIA"] as const;
export const networkDenomVariants = [...NetworkDenomVariants];

export const networkDenom: Record<Network, NetworkDenom> = {
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
    denom: networkDenom.celestia,
  },
  celestiatestnet3: {
    id: "celestiatestnet3",
    name: "Celestia Testnet",
    logo: "/networks/celestia-logo.svg",
    denom: networkDenom.celestiatestnet3,
  },
};

export const CosmosNetworkVariants = ["celestia", "celestiatestnet3"] as const;
export const cosmosNetworkVariants = [...CosmosNetworkVariants];

export const networkWalletPrefixes: Record<Network, string> = {
  celestia: "celestia1",
  celestiatestnet3: "celestia1",
};

export const BaseCurrencyVariants = ["USD", "EUR"] as const;
export const baseCurrencyVariants = [...BaseCurrencyVariants];
export const currencyRegex = /\b(usd|eur|tia)\b/i;
export const currencyMap = {
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
  celestia: 0.15,
  celestiatestnet3: 0.15,
};

export const unstakingPeriodByNetwork: Record<Network, string> = {
  celestia: "21 days",
  celestiatestnet3: "21 days",
};

export const SITE_TITLE = "Staking.xyz";
export const SITE_DESCRIPTION = "Your portal to staking";
export const SITE_URL = "https://staking.xyz";
export const SITE_IMAGE = "/og-image.png";
