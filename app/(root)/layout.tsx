import type { ReactNode } from "react";
import { WidgetProviders } from "../_providers/WidgetProviders";
import { Demo } from "../_components/Demo";
import { Header } from "../_components/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Base>
      <Header />
      <main style={{ blockSize: "100vw", inlineSize: "100vh" }}>
        {/* <Demo /> */}
        {children}
      </main>
    </Base>
  );
}

const Base = ({ children }: { children: ReactNode }) => {
  return <WidgetProviders>{children}</WidgetProviders>;
};
