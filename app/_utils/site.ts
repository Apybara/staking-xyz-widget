import type { Metadata } from "next";
import type { Network } from "../types";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  networkInfo,
  networkIdRegex,
  networkUrlParamToId,
  defaultNetwork,
} from "../consts";

export const getDefaultPageMetadata = ({
  page,
  title,
  description,
}: {
  page: string;
  title?: string;
  description?: string;
}): Metadata => ({
  title: title || getBaseMetaTitle(page),
  description: description || SITE_DESCRIPTION,
});

export const getDynamicPageMetadata = ({
  page,
  description,
  networkParam,
}: {
  page: string;
  description?: string;
  networkParam?: string;
}): Metadata => {
  const network = Array.isArray(networkParam) ? networkParam?.[0] : networkParam;
  const baseMetaTitle = getBaseMetaTitle(page);
  const networkId = networkIdRegex.test(network || "")
    ? (network as Network)
    : networkUrlParamToId[network as string] || defaultNetwork;
  const networkName = networkInfo[networkId].name;
  const dynamicTitle = networkName ? `${baseMetaTitle} ✦ ${networkName}` : baseMetaTitle;

  return {
    title: dynamicTitle,
    description: description || SITE_DESCRIPTION,
  };
};

const getBaseMetaTitle = (page: string) => (page.length ? `${page} | ${SITE_TITLE}` : SITE_TITLE);
