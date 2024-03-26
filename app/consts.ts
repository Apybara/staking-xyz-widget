import type { Network, NetworkInfo, WalletInfo, WalletType } from "./types";

export const NetworkVariants = ["celestia", "celestiatestnet3"] as const;
export const networkVariants = [...NetworkVariants];
export const networkDenom: Record<Network, string> = {
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

export const CosmosWalletVariants = ["keplr", "leap", "okx", "keplrMobile", "leapMobile"] as const;
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
    isDesktopOnly: true,
  },
  keplrMobile: {
    id: "keplrMobile",
    name: "Keplr WalletConnect",
    logo: "/wallets/keplr.svg",
    downloadLink: "https://www.keplr.app/download",
    isDesktopOnly: false,
  },
  leap: {
    id: "leap",
    name: "Leap",
    logo: "/wallets/leap.svg",
    downloadLink: "https://www.leapwallet.io/download",
    isDesktopOnly: true,
  },
  leapMobile: {
    id: "leapMobile",
    name: "Leap WalletConnect",
    logo: "/wallets/leap.svg",
    downloadLink: "https://www.leapwallet.io/download",
    isDesktopOnly: false,
  },
  okx: {
    id: "okx",
    name: "OKX wallet",
    logo: "/wallets/okx.svg",
    downloadLink: "https://www.okx.com/download",
    isDesktopOnly: true,
  },
};
export const networkWalletInfos: Record<Network, Array<WalletInfo>> = {
  celestia: [walletsInfo.keplr, walletsInfo.leap, walletsInfo.okx],
  celestiatestnet3: [walletsInfo.keplr, walletsInfo.leap],
};

export const ConnectorVariants = ["cosmosKit"] as const;
export const connectorVariants = [...ConnectorVariants];

export const SITE_TITLE = "Staking.xyz";
export const SITE_DESCRIPTION = "Your portal to staking";
export const SITE_URL = "https://staking.xyz";
export const SITE_IMAGE = "/og-image.png";
