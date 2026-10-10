import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sports — 美國三大職業運動・台灣時間賽程 × 運動商業週報",
    template: "%s | Sports",
  },
  description: "NFL、NBA、MLB 台灣時間賽程、球隊與聯盟入門、中文運動商業週報與美國觀賽旅遊規劃。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions / Chrome Translate add classes to <html>
    // before React hydrates. Applies to this element's attributes only.
    <html
      lang="zh-Hant-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
