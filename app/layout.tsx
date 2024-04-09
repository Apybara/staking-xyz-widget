import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../theme/global.css";
import "react-loading-skeleton/dist/skeleton.css";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_IMAGE } from "./consts";

const pretendard = localFont({
  src: [
    {
      path: "./_assets/PretendardStd-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./_assets/PretendardStd-SemiBold.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./_assets/PretendardStd-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
});

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
