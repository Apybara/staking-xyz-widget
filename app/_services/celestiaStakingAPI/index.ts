import type * as T from "./types";

const API_URL = process.env.NEXT_PUBLIC_STAKING_API_CELESTIA;

export const getStakeUnsignedMsg = async (address: string): Promise<string> => {
  const data: T.StakeUserGrantResponse = await fetchData(`${API_URL}stake/user/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: 1,
      granter_address: address,
      validator: "celestiavaloper1e2p4u5vqwgum7pm9vhp0yjvl58gvhfc6yfatw4",
      auth_type: ["DELEGATE", "REDELEGATE", "UNDELEGATE"],
    }),
  });

  return atob(data.unsigned_txn);
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
