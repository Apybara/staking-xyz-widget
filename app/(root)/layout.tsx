import type { ReactNode } from "react";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Header } from "../_components/Header";
import { WalletAccountDialog } from "../_components/WalletAccountDialog";
import { WalletConnectionDialog } from "../_components/WalletConnectionDialog";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main>{children}</main>
    </Base>
  );
}

const Base = ({ children }: { children: ReactNode }) => {
  return (
    <WidgetProviders>
      {children}
      <WalletAccountDialog />
      <WalletConnectionDialog />
    </WidgetProviders>
  );
};
