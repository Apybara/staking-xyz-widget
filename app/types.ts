import { TxProcedureType } from "./_services/txProcedure/types";
import {
  NetworkVariants,
  CoinVariants,
  CosmosNetworkVariants,
  cosmosTestnetVariants,
  FiatCurrencyVariants,
  CosmosWalletVariants,
  WalletVariants,
  AleoWalletVariants,
  AleoNetworkVariants,
  StakingTypeVariants,
  stakingTypeMap,
} from "./consts";

export type Network = (typeof NetworkVariants)[number];
export type NetworkInfo = {
  id: Network;
  name: string;
  logo: string;
  currency: NetworkCurrency;
  denom: string;
  supportsValidatorSelection: boolean;
};

export type CosmosNetwork = (typeof CosmosNetworkVariants)[number];
export type CosmosTestnet = (typeof cosmosTestnetVariants)[number];
export type AleoNetwork = (typeof AleoNetworkVariants)[number];

export type FiatCurrency = (typeof FiatCurrencyVariants)[number];
export type NetworkCurrency = (typeof CoinVariants)[number];
export type Currency = FiatCurrency | NetworkCurrency;
export type CoinPrice = Record<Network, Record<FiatCurrency, number>>;

export type StakingType = (typeof StakingTypeVariants)[number];
export type StakingTypeLabel = (typeof stakingTypeMap)[StakingType];
export type StakingTypeTab = {
  label: StakingTypeLabel;
  value: StakingType;
  disabled?: boolean;
};

export type CosmosWalletType = (typeof CosmosWalletVariants)[number];
export type AleoWalletType = (typeof AleoWalletVariants)[number];

export type WalletType = (typeof WalletVariants)[number];
export type WalletInfo = {
  id: WalletType;
  name: string;
  logo: string;
  downloadLink?: string;
  devicesSupport: Array<Device>;
  comingSoon?: Array<Device>;
};
export type NetworkWalletType = {
  celestia: CosmosWalletType[];
  celestiatestnet3: CosmosWalletType[];
  cosmoshub: CosmosWalletType[];
  cosmoshubtestnet: CosmosWalletType[];
};
export type WalletConnectionStatus = "connecting" | "connected" | "disconnecting" | "disconnected";

export type RouterStruct = {
  searchParams?: {
    network?: string;
    currency?: string;
    device?: Device;
    stakingType?: string;
    validator?: string;
    userId?: string;
  };
};

export type TxType = "stake" | "unstake" | "instant_unstake" | "redelegate" | "claim" | "withdraw";

type Device = "mobile" | "desktop";

export type SendingTransaction = {
  address: string;
  network: Network;
  isAleoTestnet: boolean;
  isTrackedOnPosthog: boolean;
  stakingType: StakingType;
  type: TxProcedureType;
  title: string;
  timestamp: number;
  amount: string;
  txId: string;
  status: "pending" | "success" | "failed";
};
