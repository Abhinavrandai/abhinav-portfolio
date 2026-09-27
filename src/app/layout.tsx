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
  title: "Abhinav Randai · Full-Stack Engineer",
  description:
    "Full-stack engineer building production systems on Cloudflare Workers, D1, and the edge. Portfolio, case studies, and contact.",
  keywords: [
    "Abhinav Randai",
    "Full-stack Engineer",
    "Cloudflare Workers",
    "Cloudflare D1",
    "ERP",
    "edge computing",
    "portfolio",
    "case study",
    "service bindings",
    "PBKDF2",
    "WhatsApp API",
    "R2",
  ],
  authors: [{ name: "Abhinav Randai" }],
  openGraph: {
    title: "Abhinav Randai · Full-Stack Engineer",
    description:
      "Full-stack engineer building production systems on Cloudflare Workers + D1. Portfolio, case studies, and contact.",
    siteName: "Abhinav Randai · Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinav Randai · Full-Stack Engineer",
    description:
      "Full-stack engineer building production systems on Cloudflare Workers + D1.",
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
