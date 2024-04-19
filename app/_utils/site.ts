import type { Metadata } from "next";
import type { Network } from "../types";
import { SITE_TITLE, SITE_DESCRIPTION, networkInfo } from "../consts";

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
  const baseMetaTitle = getBaseMetaTitle(page);
  const networkName = networkInfo?.[networkParam as Network]?.name;
  const dynamicTitle = networkName ? `${baseMetaTitle} ✦ ${networkName}` : baseMetaTitle;

  return {
    title: dynamicTitle,
    description: description || SITE_DESCRIPTION,
  };
};

const getBaseMetaTitle = (page: string) => (page.length ? `${page} | ${SITE_TITLE}` : SITE_TITLE);
