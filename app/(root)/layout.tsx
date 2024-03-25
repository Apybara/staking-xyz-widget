import type { ReactNode } from "react";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Header } from "../_components/Header";
import { WalletAccountDialog } from "../_components/WalletAccountDialog";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";
import { getAllCoinPrices } from "../_services/coinMarketCap";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main>{children}</main>
    </Base>
  );
}

const Base = async ({ children }: { children: ReactNode }) => {
  const coinPrices = await getAllCoinPrices({});

  return (
    <WidgetProviders initialCoinPrice={coinPrices}>
      {children}
      <WalletAccountDialog />
      <WalletConnectionDialog />
    </WidgetProviders>
  );
};
