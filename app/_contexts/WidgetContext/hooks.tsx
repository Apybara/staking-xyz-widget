import type { WidgetStates } from "./types";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLinkWithSearchParams } from "../../_utils/routes";
import { useWallet } from "../WalletContext";

export const useWidgetRouterGate = ({ status, setStates }: WidgetStates) => {
  const router = useRouter();
  const pathname = usePathname();
  const { connectionStatus } = useWallet();
  const stakePageLink = useLinkWithSearchParams("stake");
  const homePageLink = useLinkWithSearchParams("");

  useEffect(() => {
    // Redirect to the stake page on initial visit
    if (connectionStatus === "disconnected" && pathname === "/" && status === "loading") {
      router.push(stakePageLink);
      return;
    }

    // Redirect to the home page if the user is not connected and the page is the activity or rewards page
    if (
      connectionStatus === "disconnected" &&
      status !== "loading" &&
      (pathname === "/activity" || pathname === "/rewards")
    ) {
      router.push(homePageLink);
      return;
    }

    setStates({ status: "loaded" });
  }, [pathname, connectionStatus]);
};
