import type { GetCoinPriceProps, PriceConversionResponse } from "./types";
import { networkCoinPriceSymbol } from "../../consts";
import { networkPriceConversionId } from "./consts";

export const getAllCoinPrices = async ({
  amount = 1,
  currency = ["USD", "EUR"],
}: Omit<GetCoinPriceProps, "network">) => {
  const celestiaPrice = await getCoinPriceByNetwork({ network: "celestia", amount, currency });

  return {
    celestia: celestiaPrice.formatted,
    "mocha-4": celestiaPrice.formatted,
  };
};

export const getCoinPriceByNetwork = async ({ network, amount = 1, currency = ["USD", "EUR"] }: GetCoinPriceProps) => {
  try {
    const res = (await getCoinPriceFromCoinMarketCap({ network, amount, currency })) as PriceConversionResponse;
    return {
      raw: res,
      formatted: {
        USD: res.data.quote.USD.price,
        EUR: res.data.quote.EUR.price,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getCoinPriceFromCoinMarketCap = async ({ network, amount = 1, currency = ["USD", "EUR"] }: GetCoinPriceProps) => {
  return fetchData(
    `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&id=${networkPriceConversionId[network]}&convert=${currency.join(",")}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
      } as HeadersInit,
      next: {
        revalidate: 1800,
        tags: ["coin-price" + networkCoinPriceSymbol[network]],
      },
    },
  );
};

const fetchData = async (url?: string, options?: RequestInit) => {
  if (!url) throw new Error(`No URL provided for request: ${url}`);

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }
  return data;
};
