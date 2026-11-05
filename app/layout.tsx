import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteEffects } from "@/components/site-effects";
import { ScrollReveals } from "@/components/scroll-reveals";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waleed Ilyas | Full Stack Engineer · MERN, Next.js & Solana",
  description:
    "Full Stack Engineer with 3+ years of experience building MERN, Next.js, and Solana products. Explore twelve original web, product, and blockchain demos.",
  openGraph: {
    title: "Waleed Ilyas | Full Stack Engineer",
    description: "MERN, Next.js, and Solana products built from API to interface.",
    type: "website",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://waleed-ilyas-portfolio-2026.netlify.app",
  ),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteEffects />
        <ScrollReveals />
        {children}
        <Script src="/contact-copy.js" strategy="afterInteractive" />
        {process.env.NODE_ENV === "production" && (
          <Script src="/register-sw.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
