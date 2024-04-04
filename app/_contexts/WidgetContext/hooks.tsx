import type { WidgetStates } from "./types";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLinkWithSearchParams } from "../../_utils/routes";
import { useWallet } from "../WalletContext";

export const useWidgetRouterGate = ({ status, setStates }: WidgetStates) => {
  const router = useRouter();
  const pathname = usePathname();
  const { connectionStatus, connectedAddress } = useWallet();
  const link = useLinkWithSearchParams("stake");

  useEffect(() => {
    if (connectionStatus === "disconnected" && !connectedAddress.length && pathname === "/" && status === "loading") {
      router.push(link);
      return;
    }
    setStates({ status: "loaded" });
  }, [pathname, connectedAddress, connectionStatus]);
};
