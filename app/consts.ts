import type { Network, NetworkInfo } from "./types";

export const NetworkVariants = ["celestia", "mocha-4"] as const;
export const networkVariants = [...NetworkVariants];
export const networkDenom: Record<Network, string> = {
  celestia: "TIA",
  "mocha-4": "TIA",
};

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

export const BaseCurrencyVariants = ["USD", "EUR"] as const;
export const baseCurrencyVariants = [...BaseCurrencyVariants];
