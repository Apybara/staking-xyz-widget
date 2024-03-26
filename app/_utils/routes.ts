import type { RouterStruct } from "../types";

export const getCurrentSearchParams = (searchParams: RouterStruct["searchParams"]) => {
  const { network, currency, device } = searchParams || {};
  const params = new Array();

  if (network?.length) params.push(["network", network]);
  if (currency?.length) params.push(["currency", currency]);
  if (device?.length) params.push(["device", device]);

  return new URLSearchParams(params);
};
