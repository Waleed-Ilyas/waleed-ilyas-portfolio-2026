import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { SiteEffects } from "@/components/site-effects";
import { ScrollReveals } from "@/components/scroll-reveals";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Waleed Ilyas | Full Stack Engineer · MERN, Next.js & Solana",
  description:
    "Waleed Ilyas builds thoughtful full-stack products across MERN, Next.js, and Solana. Explore selected project showcases, experience, and technical skills.",
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
    <html lang="en" className={manrope.variable}>
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
