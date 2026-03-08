import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://yourdomain.com"),
  title: {
    template: "%s | Droplet — Blood Donation Platform",
    default: "Droplet — Connect Donors, Save Lives",
  },
  description:
    "Dhaka Cantonment's fastest blood donor-receiver matching platform. Find compatible donors nearby, request blood in emergencies, and save lives today.",
  keywords: [
    "blood donation",
    "blood donor",
    "blood bank",
    "donate blood",
    "blood request",
    "emergency blood",
    "O positive donor",
    "blood group",
    "Dhaka Cantonment blood",
  ],
  authors: [{ name: "Droplet Team" }],
  creator: "Droplet",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Droplet Blood Donation Platform",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@canttblood_bd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.variable} antialiased`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
