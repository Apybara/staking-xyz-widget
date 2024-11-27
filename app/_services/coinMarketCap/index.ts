import type { GetCoinPriceProps, PriceConversionResponse } from "./types";
import { networkCoinPriceSymbol } from "../../consts";
import { networkPriceConversionId } from "./consts";
import { fetchData } from "@/app/_utils/fetch";

export const getAllCoinPrices = async ({
  amount = 1,
  currency = ["USD", "EUR"],
}: Omit<GetCoinPriceProps, "network">) => {
  const cosmosPrice = {
    raw: null,
    formatted: {
      USD: 0,
      EUR: 0,
    },
  };
  const celestiaPrice = cosmosPrice;
  const cosmoshubPrice = cosmosPrice;
  const aleoPrice = await getCoinPriceByNetwork({ network: "aleo", amount, currency });

  return {
    celestia: celestiaPrice.formatted,
    celestiatestnet3: celestiaPrice.formatted,
    cosmoshub: cosmoshubPrice.formatted,
    cosmoshubtestnet: cosmoshubPrice.formatted,
    aleo: aleoPrice.formatted,
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
