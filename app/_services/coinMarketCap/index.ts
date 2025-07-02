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

const getCoinPriceFromCoinbase = async ({ coinId, amount = 1, currency = ["USD", "EUR"] }: { coinId: string; amount?: number; currency?: string[] }) => {
  // Coinbase API only supports one currency per request, so fetch both in parallel
  const supportedCurrencies = ["USD", "EUR"];
  const results: Record<string, number> = {};

  await Promise.all(
    supportedCurrencies.map(async (cur) => {
      try {
        const url = `https://api.coinbase.com/v2/prices/${coinId.toLowerCase()}-${cur.toLowerCase()}/spot`;
        const data = await fetchData(url);
        results[cur] = parseFloat(data.data.amount);
      } catch (e) {
        results[cur] = 0;
      }
    })
  );

  const now = new Date().toISOString();
  return {
    data: {
      symbol: coinId,
      id: coinId,
      name: coinId,
      amount: amount,
      last_updated: now,
      quote: {
        USD: { price: results.USD ?? 0, last_updated: now },
        EUR: { price: results.EUR ?? 0, last_updated: now },
      },
    },
    status: {
      timestamp: now,
      error_code: 0,
      error_message: '',
      elapsed: 0,
      credit_count: 0,
      notice: '',
    },
  };
};

export const getCoinPriceByNetwork = async ({ network, amount = 1, currency = ["USD", "EUR"] }: GetCoinPriceProps) => {
  try {
    const res = (await getCoinPriceFromCoinbase({ coinId: network, amount, currency })) as PriceConversionResponse;
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
