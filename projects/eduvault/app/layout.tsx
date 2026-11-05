import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "EduVault — Learning Platform Showcase",
  description: "A responsive learning dashboard and course preview with local demo progress.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
