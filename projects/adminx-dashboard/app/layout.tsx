import type { Metadata, Viewport } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "AdminX — Demo Workspace",
  description:
    "AdminX is an independent portfolio showcase concept for dashboards, operations, and team workflows. All workspace data is fictional sample data.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f6fb",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
