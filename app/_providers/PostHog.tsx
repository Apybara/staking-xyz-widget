"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    autocapture: {
      element_allowlist: ["button", "a", "input"],
    },
  });
}

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  return <PHProvider client={posthog}>{children}</PHProvider>;
};

export const PostHogPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const network = searchParams.get("network");
      const currency = searchParams.get("currency")?.toLowerCase();

      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
        active_network: network || "celestia",
        active_currency: currency || "usd",
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
};
