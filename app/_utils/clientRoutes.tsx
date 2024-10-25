"use client";

import { useSearchParams } from "next/navigation";

export const useLinkWithSearchParams = (page: string) => {
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const search = current.toString();
  const query = search ? `?${search}` : "";

  return `/${page}${query}`;
};
