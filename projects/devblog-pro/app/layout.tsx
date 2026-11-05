import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-shell";
import "./styles.css";

export const metadata: Metadata = {
  title: {
    default: "DevBlog Pro — Product Engineering Notes",
    template: "%s · DevBlog Pro",
  },
  description:
    "An independent MDX blog showcase with editorial search, readable long-form articles, and offline-first demo interactions.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "DevBlog Pro — Product Engineering Notes",
    description: "A local-first blog platform showcase with original sample articles.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
