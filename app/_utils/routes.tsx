import type { RouterStruct } from "../types";
import { useSearchParams } from "next/navigation";

export const getCurrentSearchParams = (searchParams: RouterStruct["searchParams"]) => {
  const { network, currency, device } = searchParams || {};
  const params = new Array();

  if (network?.length) params.push(["network", network]);
  if (currency?.length) params.push(["currency", currency]);
  if (device?.length) params.push(["device", device]);

  return new URLSearchParams(params);
};

export const getLinkWithSearchParams = (searchParams: RouterStruct["searchParams"], page: string) => {
  const current = getCurrentSearchParams(searchParams);
  const search = current.toString();
  const query = search ? `?${search}` : "";
  return `/${page}${query}`;
};

export const useLinkWithSearchParams = (page: string) => {
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const search = current.toString();
  const query = search ? `?${search}` : "";

  return `/${page}${query}`;
};
