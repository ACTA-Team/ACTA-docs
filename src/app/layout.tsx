import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { ThemeProvider } from "@/providers/theme.provider";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.acta.build"),
  title: {
    default: "ACTA Documentation",
    template: "%s · ACTA Docs",
  },
  description:
    "Official documentation for ACTA: verifiable credentials infrastructure on Stellar. API reference, SDK guides, did:stellar, and smart contracts.",
  generator: "ACTA",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "ACTA Documentation",
    type: "website",
    url: "https://docs.acta.build",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: next-themes + extensions that inject attrs on <body> (e.g. bis_*) */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PostHogProvider>
            <I18nProvider>{children}</I18nProvider>
            <Analytics />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
