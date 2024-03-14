import type { Metadata } from "next";
import "../theme/global.css";
import localFont from "next/font/local";
import { WidgetProviders } from "./_providers/WidgetProviders";

const pretendard = localFont({
  src: "./_assets/PretendardStdVariable.woff2",
  display: "swap",
});

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
    <html lang="en" className={pretendard.className}>
      <body>
        <WidgetProviders>{children}</WidgetProviders>
      </body>
    </html>
  );
}
