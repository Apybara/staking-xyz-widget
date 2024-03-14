import type { ReactNode } from "react";
import type { Metadata } from "next";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Demo } from "../_components/Demo";

export const metadata: Metadata = {
  title: "Staking.xyz",
  description: "Your portal to staking",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <main style={{ blockSize: "100vw", inlineSize: "100vh" }}>
        <Demo />
        {children}
      </main>
    </Base>
  );
}

const Base = ({ children }: { children: ReactNode }) => {
  return <WidgetProviders>{children}</WidgetProviders>;
};
