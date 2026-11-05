import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Sora } from "next/font/google";
import Script from "next/script";
import { SiteEffects } from "@/components/site-effects";
import { ScrollReveals } from "@/components/scroll-reveals";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "600"],
});
const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "600"],
});
const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Waleed Ilyas | Full Stack Developer · MERN & Solana",
  description:
    "Waleed Ilyas is a Full Stack Developer with 3+ years of experience across MERN, Next.js, and Solana. Explore selected independent showcases, experience, and skills.",
  openGraph: {
    title: "Waleed Ilyas | Full Stack Developer",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
