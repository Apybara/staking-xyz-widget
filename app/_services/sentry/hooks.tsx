import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useWallet } from "@/app/_contexts/WalletContext";

export const useSentry = () => {
  const { connectionStatus, address, activeWallet } = useWallet();

  // Init replay
  useEffect(() => {
    const replay = Sentry.getReplay();
    replay?.start();
  }, []);

  // Identify user traits
  useEffect(() => {
    if (connectionStatus !== "connected" && !address) {
      return;
    }

    Sentry.setTag("address", address);
    Sentry.setTag("wallet", activeWallet);
  }, [connectionStatus, address, activeWallet]);
};
