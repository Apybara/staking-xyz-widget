import type { Metadata } from "next";
import "../theme/global.css";
import { WidgetProviders } from "./_providers/WidgetProviders";

export const metadata: Metadata = {
  title: "Staking.xyz",
  description: "Your portal to staking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WidgetProviders>{children}</WidgetProviders>
      </body>
    </html>
  );
}
