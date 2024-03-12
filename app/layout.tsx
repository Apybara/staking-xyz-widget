import type { Metadata } from "next";
import "../theme/global.css";

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
      <body>{children}</body>
    </html>
  );
}
