import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { networkCurrency, defaultNetwork } from "../../consts";
import {
  getFormattedCoinValue,
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getDynamicAssetValueFromCoin,
} from ".";

export const useDynamicAssetValueFromCoin = ({ coinVal }: { coinVal?: string | number }) => {
  const { currency, coinPrice, network } = useShell();
  return getDynamicAssetValueFromCoin({ coinVal, currency, coinPrice, network });
};

export const useFormattedNetworkValue = ({ val }: { val?: string | number }) => {
  const { network, currency, coinPrice } = useShell();
  const castedNetwork = network || defaultNetwork;
  const castedCurrency = currency || networkCurrency[castedNetwork];
  const isFiatCurrency = castedCurrency === "USD" || castedCurrency === "EUR";

  if (!val) return undefined;

  if (!isFiatCurrency) {
    return getFormattedCoinValue({
      val: BigNumber(val).toNumber(),
      formatOptions: {
        currencySymbol: networkCurrency[castedNetwork],
      },
    });
  }

  const price = coinPrice?.[castedNetwork]?.[castedCurrency] || 0;
  if (castedCurrency === "USD") {
    return getFormattedUSDPriceFromCoin({ val, price });
  }
  if (castedCurrency === "EUR") {
    return getFormattedEURPriceFromCoin({ val, price });
  }
};
