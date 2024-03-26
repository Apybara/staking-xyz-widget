import type { ReactNode } from "react";
import cn from "classnames";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { WalletAccountDialog } from "../_components/WalletAccountDialog";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";
import { getAllCoinPrices } from "../_services/coinMarketCap";
import * as S from "./root.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main className={cn(S.main)}>{children}</main>
      <Footer />
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
      <div className={cn(S.base)}>{children}</div>
      <WalletAccountDialog />
      <WalletConnectionDialog />
    </WidgetProviders>
  );
};
