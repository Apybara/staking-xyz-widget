import type { WidgetStates } from "./types";
import { useEffect } from "react";
import { useWallet } from "../WalletContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useWidgetRouterGate = ({ status, setStates }: WidgetStates) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { connectionStatus, connectedAddress } = useWallet();

  useEffect(() => {
    if (connectionStatus === "disconnected" && !connectedAddress.length && pathname === "/" && status === "loading") {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/stake${query}`);
      return;
    }
    setStates({ status: "loaded" });
  }, [pathname, connectedAddress, connectionStatus]);
};
