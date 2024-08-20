import { fetchData } from "@/app/_utils/fetch";

export const getPondoData = async ({ apiUrl }: { apiUrl: string }) => {
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
