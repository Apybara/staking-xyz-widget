import type { Network, NetworkInfo, WalletInfo, WalletType } from "./types";

export const NetworkVariants = ["celestia", "mocha-4"] as const;
export const networkVariants = [...NetworkVariants];
export const networkDenom: Record<Network, string> = {
  celestia: "TIA",
  "mocha-4": "TIA",
};
export const networkCoinPriceSymbol: Record<Network, string> = {
  celestia: "celestia",
  "mocha-4": "celestia",
};
export const networkRegex = /(celestia|mocha-4)/;

export const networkInfo: Record<Network, NetworkInfo> = {
  celestia: {
    id: "celestia",
    name: "Celesita",
    logo: "/networks/celestia-logo.svg",
    denom: networkDenom.celestia,
  },
  "mocha-4": {
    id: "mocha-4",
    name: "Celestia Testnet",
    logo: "/networks/celestia-logo.svg",
    denom: networkDenom["mocha-4"],
  },
};

export const CosmosNetworkVariants = ["celestia", "mocha-4"] as const;
export const cosmosNetworkVariants = [...CosmosNetworkVariants];

export const networkWalletPrefixes: Record<Network, string> = {
  celestia: "celestia1",
  "mocha-4": "celestia1",
};

export const BaseCurrencyVariants = ["USD", "EUR"] as const;
export const baseCurrencyVariants = [...BaseCurrencyVariants];
export const currencyRegex = /(usd|eur|tia)/i;

export const CosmosWalletVariants = [
  "keplr",
  "leap",
  // 'okx',
] as const;
export const cosmosWalletVariants = [...CosmosWalletVariants];

export const WalletVariants = [...cosmosWalletVariants] as const;
export const walletVariants = [...WalletVariants];

export const networkWalletVariants: Record<Network, Array<string>> = {
  celestia: cosmosWalletVariants,
  "mocha-4": cosmosWalletVariants,
};

export const walletsInfo: Record<WalletType, WalletInfo> = {
  keplr: {
    id: "keplr",
    name: "Keplr",
    logo: "/wallets/keplr.svg",
  },
  leap: {
    id: "leap",
    name: "Leap",
    logo: "/wallets/leap.svg",
  },
};
export const networkWalletInfos: Record<Network, Array<WalletInfo>> = {
  celestia: [walletsInfo.keplr, walletsInfo.leap],
  "mocha-4": [walletsInfo.keplr, walletsInfo.leap],
};

export const ConnectorVariants = ["cosmosKit"] as const;
export const connectorVariants = [...ConnectorVariants];

export const SITE_TITLE = "Staking.xyz";
export const SITE_DESCRIPTION = "Your portal to staking";
export const SITE_URL = "https://staking.xyz";
export const SITE_IMAGE = "/og-image.png";
