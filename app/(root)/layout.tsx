import type { ReactNode } from "react";
import cn from "classnames";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { WidgetShell } from "../_components/WidgetShell";
import { WalletAccountDialog } from "../_components/WalletAccountDialog";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";
import { SendingTransactionsDialog } from "../_components/SendingTransactionsDialog";
// import { TxSentDialog } from "./_components/TxSentDialog";
import { QuestWarningBannerAndDialog } from "../_components/QuestWarningBannerAndDialog";
import { getAllCoinPrices } from "../_services/coinMarketCap";
import * as S from "./root.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main className={cn(S.main)}>
        <QuestWarningBannerAndDialog />
        <WidgetShell>{children}</WidgetShell>
      </main>
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
      {/* <TxSentDialog /> */}
      <SendingTransactionsDialog />
    </WidgetProviders>
  );
};
