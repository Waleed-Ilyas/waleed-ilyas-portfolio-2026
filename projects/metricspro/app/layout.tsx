import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "MetricsPro — Analytics Dashboard Showcase",
  description: "A sample SaaS analytics workspace with local dashboard interactions.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
