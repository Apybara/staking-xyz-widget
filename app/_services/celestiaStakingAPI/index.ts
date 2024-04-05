import type * as T from "./types";

const API_URL = process.env.NEXT_PUBLIC_STAKING_API_CELESTIA;

export const getAddressAuthCheck = async (address: string) => {
  const res: T.AuthCheckResponse = await fetchData(`${API_URL}address/authorization/check/${address}`);
  return res.granted;
};

export const getDelegateMessage = async (address: string, amount: number) => {
  const res: T.DelegateMessageResponse = await fetchData(`${API_URL}stake/user/delegate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ granter_address: address, amount }),
  });
  return res.unsigned_txn;
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
