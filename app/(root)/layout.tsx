import type { ReactNode } from "react";
import { headers } from "next/headers";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Header } from "../_components/Header";
import { WalletAccountDialog } from "../_components/WalletAccountDialog";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";
import { getAllCoinPrices } from "../_services/coinMarketCap";
import { UAParser } from "ua-parser-js";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main>{children}</main>
    </Base>
  );
}

const Base = async ({ children }: { children: ReactNode }) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const { type } = new UAParser(userAgent || undefined).getDevice();
  const coinPrices = await getAllCoinPrices({});

  return (
    <WidgetProviders
      initialCoinPrice={coinPrices}
      isOnMobileDevice={type !== undefined}
      walletConnectAPIKey={process.env.WALLET_CONNECT_API_KEY || ""}
    >
      {children}
      <WalletAccountDialog />
      <WalletConnectionDialog />
    </WidgetProviders>
  );
};
