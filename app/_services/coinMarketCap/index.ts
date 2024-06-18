import type { GetCoinPriceProps, PriceConversionResponse } from "./types";
import { networkCoinPriceSymbol } from "../../consts";
import { networkPriceConversionId } from "./consts";
import { fetchData } from "@/app/_utils/fetch";

export const getAllCoinPrices = async ({
  amount = 1,
  currency = ["USD", "EUR"],
}: Omit<GetCoinPriceProps, "network">) => {
  const celestiaPrice = await getCoinPriceByNetwork({ network: "celestia", amount, currency });
  const cosmoshubPrice = await getCoinPriceByNetwork({ network: "cosmoshub", amount, currency });
  const aleoPrice = {
    USD: 1,
    EUR: 1,
  }; // TODO: Add Aleo price

  return {
    celestia: celestiaPrice.formatted,
    celestiatestnet3: celestiaPrice.formatted,
    cosmoshub: cosmoshubPrice.formatted,
    cosmoshubtestnet: cosmoshubPrice.formatted,
    aleo: aleoPrice,
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
