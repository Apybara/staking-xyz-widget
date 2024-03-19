import type { Metadata, Viewport } from "next";
import "../theme/global.css";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "./_assets/PretendardStdVariable.woff2",
  display: "swap",
});

const SITE_TITLE = "Staking.xyz";
const SITE_DESCRIPTION = "Your portal to staking";
const SITE_URL = "https://staking.xyz";
const SITE_IMAGE = "/og-image.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      {
        rel: "icon",
        url: "/favicons/favicon.ico",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/favicons/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        rel: "apple-touch-icon",
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: {
      url: SITE_IMAGE,
      type: "image/png",
      width: 1200,
      height: 630,
    },
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@staking_xyz",
    card: "summary_large_image",
    images: {
      url: SITE_IMAGE,
      type: "image/png",
      width: 1200,
      height: 630,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.className}>
      <body>{children}</body>
    </html>
  );
}
