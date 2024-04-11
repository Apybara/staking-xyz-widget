import type * as T from "./types";

const API_URL = process.env.NEXT_PUBLIC_STAKING_API_CELESTIA;

export const getAddressAuthCheck = async (address: string) => {
  const res: T.AuthCheckResponse = await fetchData(`${API_URL}address/check/${address}`);
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
  return JSON.parse(atob(res.unsigned_txn)) as T.DecodedDelegateMessageResponse;
};

export const getDelegateValidatorMessages = (operatorMessage: T.DecodedDelegateMessageResponse) => {
  return operatorMessage.body.messages
    .filter((msg) => msg["@type"] === "/cosmos.staking.v1beta1.MsgDelegate")
    .map((msg: T.CosmosStakingMsgDelegate) => ({ validator: msg.validator_address, amount: msg.amount }));
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
