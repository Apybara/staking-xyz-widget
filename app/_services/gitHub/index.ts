import type { LatestReleaseResponse } from "./types";
import { fetchData } from "@/app/_utils/fetch";

export const getLatestReleaseTag = async (): Promise<string> => {
  try {
    const latestRelease = await getLatestRelease();
    return latestRelease.tag_name;
  } catch (error) {
    console.error("Failed to get latest release tag from GitHub", error);
    return process.env.NEXT_PUBLIC_STATIC_RELEASE_TAG || "v0.0.0";
  }
};

const getLatestRelease = async (): Promise<LatestReleaseResponse> => {
  return fetchData(`${rootEndpoint}/releases/latest`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    } as HeadersInit,
    next: {
      revalidate: 43200, // 12 hours
      tags: ["latestReleaseFromGitHub"],
    },
  });
};

const rootEndpoint = `https://api.github.com/repos/Apybara/staking-xyz-widget`;
