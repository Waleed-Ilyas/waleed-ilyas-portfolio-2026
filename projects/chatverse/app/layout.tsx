import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "ChatVerse — Local Chat UI Showcase",
  description: "A responsive chat application concept with local-only demo messages.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
