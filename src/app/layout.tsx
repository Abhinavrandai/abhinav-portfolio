import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jalaram Feeds ERP — A Cloudflare Workers Case Study | Abhinav Randai",
  description:
    "A full-scale ERP for an animal-feed manufacturer, migrated from Google Apps Script to Cloudflare Workers + D1. 6 Workers, 8 D1 databases, 22k lines, 39 test files, zero-downtime migration.",
  keywords: [
    "Cloudflare Workers",
    "Cloudflare D1",
    "ERP",
    "PBKDF2",
    "service bindings",
    "Workers AI",
    "Browser Rendering",
    "WhatsApp API",
    "R2",
    "edge computing",
    "Abhinav Randai",
    "case study",
  ],
  authors: [{ name: "Abhinav Randai" }],
  openGraph: {
    title: "Jalaram Feeds ERP — A Cloudflare Workers Case Study",
    description:
      "6 Workers. 8 D1 databases. 22k lines. Zero downtime migration from Google Apps Script to the Cloudflare edge.",
    siteName: "Abhinav Randai · Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jalaram Feeds ERP — Case Study",
    description:
      "A full-scale ERP migrated from Apps Script to Cloudflare Workers + D1.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
