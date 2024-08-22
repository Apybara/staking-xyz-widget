import { fetchData } from "@/app/_utils/fetch";

export const getPondoData = async ({ apiUrl }: { apiUrl: string }): Promise<PondoDataResult> => {
  const res = await fetchData(`${apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMostRecentPondoData",
    }),
  });
  return res.result;
};

type PondoDataResult = {
  protocolBalance: string;
  totalCredits: string;
  pondoTVL: string;
  bondedWithdrawals: string;
  lastDelegatedBalance: string;
  reservedForWithdrawals: string;
  protocolState: string;
  mintedPaleo: string;
  paleoSupply: string;
  pondoSupply: string;
};
