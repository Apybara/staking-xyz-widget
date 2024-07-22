import type { Network, NetworkInfo, NetworkCurrency, WalletInfo, WalletType, StakingType } from "./types";
import CelestiaLogo from "./_assets/networks/celestia-logo.svg";
import CosmosHubLogo from "./_assets/networks/cosmos-hub-logo.svg";
import AleoLogo from "./_assets/networks/aleo-logo.svg";

export const NetworkVariants = ["cosmoshub", "cosmoshubtestnet", "celestia", "celestiatestnet3", "aleo"] as const;
export const networkVariants = [...NetworkVariants];
export const defaultNetwork = NetworkVariants[0] as Network;

export const CoinVariants = ["TIA", "ATOM", "ALEO"] as const;
export const coinVariants = [...CoinVariants];

export const networkCurrency: Record<Network, NetworkCurrency> = {
  celestia: "TIA",
  celestiatestnet3: "TIA",
  cosmoshub: "ATOM",
  cosmoshubtestnet: "ATOM",
  aleo: "ALEO",
};
export const networkCoinPriceSymbol: Record<Network, string> = {
  celestia: "celestia",
  celestiatestnet3: "celestia",
  cosmoshub: "cosmoshub",
  cosmoshubtestnet: "cosmoshub",
  aleo: "", // TODO: Add Aleo price symbol
};

export const networkIdToUrlParamAlias: Record<Network, string> = {
  celestia: "celestia",
  celestiatestnet3: "celestiatestnet",
  cosmoshub: "cosmoshub",
  cosmoshubtestnet: "cosmoshubtestnet",
  aleo: "aleo",
};
export const networkUrlParamToId: Record<string, Network> = {
  celestia: "celestia",
  celestiatestnet: "celestiatestnet3",
  celestiatestnet3: "celestiatestnet3",
  cosmoshub: "cosmoshub",
  cosmoshubtestnet: "cosmoshubtestnet",
  aleo: "aleo",
};
export const networkIdRegex = /\b(celestia|celestiatestnet3|cosmoshub|cosmoshubtestnet|aleo)\b/;
export const networkUrlParamRegex = /\b(celestia|celestiatestnet|cosmoshub|cosmoshubtestnet|aleo)\b/;

export const networkInfo: Record<Network, NetworkInfo> = {
  celestia: {
    id: "celestia",
    name: "Celestia",
    logo: CelestiaLogo,
    currency: networkCurrency.celestia,
    denom: "u" + networkCurrency.celestia.toLowerCase(),
    supportsValidatorSelection: false,
  },
  celestiatestnet3: {
    id: "celestiatestnet3",
    name: "Celestia Testnet",
    logo: CelestiaLogo,
    currency: networkCurrency.celestiatestnet3,
    denom: "u" + networkCurrency.celestiatestnet3.toLowerCase(),
    supportsValidatorSelection: false,
  },
  cosmoshub: {
    id: "cosmoshub",
    name: "Cosmos Hub",
    logo: CosmosHubLogo,
    currency: networkCurrency.cosmoshub,
    denom: "u" + networkCurrency.cosmoshub.toLowerCase(),
    supportsValidatorSelection: false,
  },
  cosmoshubtestnet: {
    id: "cosmoshubtestnet",
    name: "Cosmos Hub Testnet",
    logo: CosmosHubLogo,
    currency: networkCurrency.cosmoshubtestnet,
    denom: "u" + networkCurrency.cosmoshubtestnet.toLowerCase(),
    supportsValidatorSelection: false,
  },
  aleo: {
    id: "aleo",
    name: "Aleo Testnet",
    logo: AleoLogo,
    currency: networkCurrency.aleo,
    denom: "",
    supportsValidatorSelection: true,
  },
};

export const networkDefaultGasPrice: Record<Network, number> = {
  celestia: 0.02,
  celestiatestnet3: 0.02,
  cosmoshub: 0.02,
  cosmoshubtestnet: 0.02,
  aleo: 0,
};

export const networkExplorer: Record<Network, string> = {
  celestia: "https://www.mintscan.io/celestia/",
  celestiatestnet3: "https://www.mintscan.io/celestia-testnet/",
  cosmoshub: "https://www.mintscan.io/cosmos/",
  cosmoshubtestnet: "https://www.mintscan.io/cosmoshub-testnet/",
  // TODO: use dynamic Aleo network
  aleo: "https://testnet.aleoscan.io/",
};

export const networkExplorerTx: Record<Network, string> = {
  celestia: `${networkExplorer.celestia}tx/`,
  celestiatestnet3: `${networkExplorer.celestiatestnet3}tx/`,
  cosmoshub: `${networkExplorer.cosmoshub}tx/`,
  cosmoshubtestnet: `${networkExplorer.cosmoshubtestnet}tx/`,
  aleo: `${networkExplorer.aleo}transaction?id=`,
};

export const networkExplorerAddress: Record<Network, string> = {
  celestia: `${networkExplorer.celestia}address/`,
  celestiatestnet3: `${networkExplorer.celestiatestnet3}address/`,
  cosmoshub: `${networkExplorer.cosmoshub}address/`,
  cosmoshubtestnet: `${networkExplorer.cosmoshubtestnet}address/`,
  aleo: `${networkExplorer.aleo}address?a=`,
};

export const CosmosNetworkVariants = ["celestia", "celestiatestnet3", "cosmoshub", "cosmoshubtestnet"] as const;
export const cosmosNetworkVariants = [...CosmosNetworkVariants];

export const CosmosTestnetVariants = ["celestiatestnet3", "cosmoshubtestnet"] as const;
export const cosmosTestnetVariants = [...CosmosTestnetVariants];

export const AleoNetworkVariants = ["aleo"] as const;
export const aleoNetworkVariants = [...AleoNetworkVariants];

export const networkWalletPrefixes: Record<Network, string> = {
  celestia: "celestia1",
  celestiatestnet3: "celestia1",
  cosmoshub: "cosmos1",
  cosmoshubtestnet: "cosmos1",
  aleo: "aleo1",
};

export const mobileDisabledNetworks = networkVariants.filter(
  (network) => network === "celestiatestnet3" || network === "cosmoshubtestnet",
);

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
  cosmoshub: {
    rpc: process.env.NEXT_PUBLIC_COSMOSHUB_RPC_ENDPOINT || "https://cosmos-rpc.publicnode.com/",
    rest: process.env.NEXT_PUBLIC_COSMOSHUB_REST_ENDPOINT || "https://cosmos-rest.publicnode.com/",
  },
  cosmoshubtestnet: {
    rpc: process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_RPC_ENDPOINT || "https://rpc.sentry-01.theta-testnet.polypore.xyz/",
    rest:
      process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REST_ENDPOINT || "https://rest.sentry-01.theta-testnet.polypore.xyz/",
  },
  aleo: {
    rpc: "",
    rest: "",
  },
};

export const FiatCurrencyVariants = ["USD", "EUR"] as const;
export const fiatCurrencyVariants = [...FiatCurrencyVariants];

export const currencyRegex = /\b(usd|eur|tia|atom|aleo)\b/i;
export const fiatCurrencyMap = {
  USD: "$",
  EUR: "€",
};
export const defaultGlobalCurrency = networkCurrency[defaultNetwork];

export const StakingTypeVariants = ["native", "liquid"] as const;
export const stakingTypeVariants = [...StakingTypeVariants];

export const stakingTypeRegex = /\b(native|liquid)\b/i;
export const stakingTypeMap = {
  native: "Native staking",
  liquid: "Liquid staking",
};

export const networkDefaultStakingType: Record<Network, StakingType | null> = {
  celestia: null,
  celestiatestnet3: null,
  cosmoshub: null,
  cosmoshubtestnet: null,
  aleo: "native",
};

export const CosmosWalletVariants = ["keplr", "keplrMobile", "leap", "leapMobile", "okx", "walletConnect"] as const;
export const cosmosWalletVariants = [...CosmosWalletVariants];

export const AleoWalletVariants = ["leoWallet", "puzzle"] as const;
export const aleoWalletVariants = [...AleoWalletVariants];

export const WalletVariants = [...cosmosWalletVariants, ...aleoWalletVariants] as const;
export const walletVariants = [...WalletVariants];

export const networkWalletVariants: Record<Network, Array<string>> = {
  celestia: cosmosWalletVariants,
  celestiatestnet3: cosmosWalletVariants,
  cosmoshub: cosmosWalletVariants,
  cosmoshubtestnet: cosmosWalletVariants,
  aleo: aleoWalletVariants,
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
    comingSoon: ["mobile"],
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
    comingSoon: ["mobile"],
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
  leoWallet: {
    id: "leoWallet",
    name: "Leo Wallet",
    logo: "/wallets/leoWallet.svg",
    downloadLink: "https://www.leo.app/download",
    devicesSupport: ["desktop", "mobile"],
    comingSoon: ["mobile"],
  },
  puzzle: {
    id: "puzzle",
    name: "Puzzle",
    logo: "/wallets/puzzle.svg",
    downloadLink: "https://puzzle.online/",
    devicesSupport: ["desktop", "mobile"],
  },
};

export const aleoDefaultStakeFee = "182079";
export const aleoDefaultUnstakeFee = "365356";
export const aleoDefaultClaimFee = "88711";

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
  cosmoshub: [
    walletsInfo.keplr,
    walletsInfo.leap,
    walletsInfo.okx,
    walletsInfo.keplrMobile,
    walletsInfo.leapMobile,
    walletsInfo.walletConnect,
  ],
  cosmoshubtestnet: [walletsInfo.keplr, walletsInfo.leap, walletsInfo.keplrMobile, walletsInfo.leapMobile],
  aleo: [walletsInfo.leoWallet, walletsInfo.puzzle],
};

export const feeRatioByNetwork: Record<Network, number> = {
  celestia:
    process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE && !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_CELESTIA_FEE_RATE)
      : 0.03,
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_FEE_RATE &&
    !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_FEE_RATE)
      : 0.03,
  cosmoshub:
    process.env.NEXT_PUBLIC_COSMOSHUB_FEE_RATE && !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUB_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUB_FEE_RATE)
      : 0.03,
  cosmoshubtestnet:
    process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_FEE_RATE &&
    !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_FEE_RATE))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_FEE_RATE)
      : 0.03,
  aleo: 0,
};

export const feeReceiverByNetwork: Record<Network, string> = {
  celestia: process.env.NEXT_PUBLIC_CELESTIA_FEE_RECEIVER || "",
  celestiatestnet3: process.env.NEXT_PUBLIC_CELESTIATESTNET3_FEE_RECEIVER || "",
  cosmoshub: process.env.NEXT_PUBLIC_COSMOSHUB_FEE_RECEIVER || "",
  cosmoshubtestnet: process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_FEE_RECEIVER || "",
  aleo: "",
};

export const requiredBalanceStakingByNetwork: Record<Network, number> = {
  celestia:
    process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_STAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_STAKING))
      ? Number(process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_STAKING)
      : 0.05,
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_STAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_STAKING))
      ? Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_STAKING)
      : 0.05,
  cosmoshub:
    process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_STAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_STAKING))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_STAKING)
      : 0.05,
  cosmoshubtestnet:
    process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_STAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_STAKING))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_STAKING)
      : 0.05,
  aleo:
    process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_STAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_STAKING))
      ? Number(process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_STAKING)
      : 1,
};

export const requiredBalanceUnstakingByNetwork: Record<Network, number> = {
  celestia:
    process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_UNSTAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_UNSTAKING))
      ? Number(process.env.NEXT_PUBLIC_CELESTIA_REQUIRED_BALANCE_UNSTAKING)
      : 0.03,
  celestiatestnet3:
    process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_UNSTAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_UNSTAKING))
      ? Number(process.env.NEXT_PUBLIC_CELESTIATESTNET3_REQUIRED_BALANCE_UNSTAKING)
      : 0.03,
  cosmoshub:
    process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_UNSTAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_UNSTAKING))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUB_REQUIRED_BALANCE_UNSTAKING)
      : 0.03,
  cosmoshubtestnet:
    process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_UNSTAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_UNSTAKING))
      ? Number(process.env.NEXT_PUBLIC_COSMOSHUBTESTNET_REQUIRED_BALANCE_UNSTAKING)
      : 0.03,
  aleo:
    process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_UNSTAKING &&
    !isNaN(Number(process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_UNSTAKING))
      ? Number(process.env.NEXT_PUBLIC_ALEO_REQUIRED_BALANCE_UNSTAKING)
      : 1,
};

export const minInitialStakingAmountByNetwork: Record<Network, Record<StakingType, number | null>> = {
  celestia: {
    native: null,
    liquid: null,
  },
  celestiatestnet3: {
    native: null,
    liquid: null,
  },
  cosmoshub: {
    native: null,
    liquid: null,
  },
  cosmoshubtestnet: {
    native: null,
    liquid: null,
  },
  aleo: {
    native: 10000,
    liquid: null,
  },
};

export const minSubsequentStakingAmountByNetwork: Record<Network, Record<StakingType, number | null>> = {
  celestia: {
    native: null,
    liquid: null,
  },
  celestiatestnet3: {
    native: null,
    liquid: null,
  },
  cosmoshub: {
    native: null,
    liquid: null,
  },
  cosmoshubtestnet: {
    native: null,
    liquid: null,
  },
  aleo: {
    native: 1,
    liquid: null,
  },
};

export const unstakingPeriodByNetwork: Record<Network, string> = {
  celestia: "21 days",
  celestiatestnet3: "21 days",
  cosmoshub: "21 days",
  cosmoshubtestnet: "21 days",
  aleo: "1 hour",
};

export const rewardsFrequencyByNetwork: Record<Network, string> = {
  celestia: "15s",
  celestiatestnet3: "15s",
  cosmoshub: "7.23s",
  cosmoshubtestnet: "7.23s",
  aleo: "10s",
};

export const stakingOperatorUrlByNetwork: Record<Network, string> = {
  celestia: process.env.NEXT_PUBLIC_STAKING_API_CELESTIA || "",
  celestiatestnet3: process.env.NEXT_PUBLIC_STAKING_API_CELESTIA_TESTNET || "",
  cosmoshub: process.env.NEXT_PUBLIC_STAKING_API_COSMOSHUB || "",
  cosmoshubtestnet: process.env.NEXT_PUBLIC_STAKING_API_COSMOSHUB_TESTNET || "",
  // TODO: use dynamic Aleo network
  aleo: process.env.NEXT_PUBLIC_STAKING_API_ALEO_TESTNET || "",
};

export const serverUrlByNetwork: Record<Network, string> = {
  celestia: process.env.NEXT_PUBLIC_SERVER_API_CELESTIA || "",
  celestiatestnet3: process.env.NEXT_PUBLIC_SERVER_API_CELESTIA_TESTNET || "",
  cosmoshub: process.env.NEXT_PUBLIC_SERVER_API_COSMOSHUB || "",
  cosmoshubtestnet: process.env.NEXT_PUBLIC_SERVER_API_COSMOSHUB_TESTNET || "",
  // TODO: use dynamic Aleo network
  aleo: process.env.NEXT_PUBLIC_SERVER_API_ALEO_TESTNET || "",
};

// TODO: use dynamic Aleo network
export const aleoRestUrl = "https://api.explorer.aleo.org/v1/testnet/";

export const SITE_TITLE = "Staking.xyz";
export const SITE_DESCRIPTION = "Your portal to staking.";
export const SITE_URL = "https://staking.xyz";
export const SITE_IMAGE = "/og-image.jpg";
export const SITE_WALLET_CONNECT_LOGO = "https://www.staking.xyz/favicons/favicon-512.png";

export const TWITTER_URL = "https://twitter.com/staking_xyz";
export const TELEGRAM_URL = "https://t.me/staking_xyz";

export const PONDO_URL = "https://pondo.xyz";
export const VERIDISE_URL = "https://veridise.com";
