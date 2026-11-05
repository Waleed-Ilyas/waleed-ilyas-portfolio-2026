import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "HireHub — Local Job Search Showcase",
  description: "A responsive job discovery concept with clearly labeled sample listings.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
