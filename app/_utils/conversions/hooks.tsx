import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { networkCurrency } from "../../consts";
import { getFormattedCoinValue, getFormattedUSDPriceFromCoin, getFormattedEURPriceFromCoin } from ".";

export const useFormattedNetworkValue = ({ val }: { val?: string | number }) => {
  const { network, currency, coinPrice } = useShell();
  const castedNetwork = network || "celestia";
  const castedCurrency = currency || networkCurrency[castedNetwork];
  const isFiatCurrency = castedCurrency === "USD" || castedCurrency === "EUR";

  if (!val) return undefined;

  if (!isFiatCurrency) {
    return getFormattedCoinValue({ val: BigNumber(val).toNumber() });
  }

  const price = coinPrice?.[castedNetwork]?.[castedCurrency] || 0;
  if (castedCurrency === "USD") {
    return getFormattedUSDPriceFromCoin({ val, price });
  }
  if (castedCurrency === "EUR") {
    return getFormattedEURPriceFromCoin({ val, price });
  }
};
