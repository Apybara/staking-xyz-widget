import type { WidgetStates } from "./types";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { defaultNetwork, mobileDisabledNetworks } from "../../consts";
import { useLinkWithSearchParams } from "../../_utils/routes";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";

export const useWidgetRouterGate = ({ status, setStates }: WidgetStates) => {
  const router = useRouter();
  const pathname = usePathname();
  const { connectionStatus } = useWallet();
  const stakePageLink = useLinkWithSearchParams("stake");
  const homePageLink = useLinkWithSearchParams("");

  const { isOnMobileDevice } = useShell();
  const searchParams = useSearchParams();

  // Redirect to the stake page on initial visit
  useEffect(() => {
    if (pathname === "/" && status === "loading") {
      router.push(stakePageLink);
      return;
    }

    setStates({ status: "loaded" });
  }, [pathname, status]);

  // Redirect to the home page if the user is not connected and the page is the activity or rewards page
  useEffect(() => {
    if (
      connectionStatus === "disconnected" &&
      status !== "loading" &&
      ["/activity", "/rewards", "rewards/history"].includes(pathname)
    ) {
      router.push(homePageLink);
    }
  }, [pathname, connectionStatus]);

  // Redirect to the default network if the current network is disabled on mobile
  useEffect(() => {
    if (!isOnMobileDevice) return;

    const network = searchParams.get("network");
    const isMobileDisabled = mobileDisabledNetworks.some((disabledNetwork) => disabledNetwork === network);

    if (isMobileDisabled) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("network", defaultNetwork);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`/stake${query}`);
    }
  }, [searchParams]);
};
