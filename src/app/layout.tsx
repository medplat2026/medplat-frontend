import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3021";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MedPlat",
  description: "Hospital and patient onboarding for verified medical fundraising",
  openGraph: {
    title: "MedPlat",
    description: "Hospital and patient onboarding for verified medical fundraising",
    url: siteUrl,
    siteName: "MedPlat",
    locale: "en",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
