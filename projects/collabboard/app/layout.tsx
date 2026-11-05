import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "CollabBoard — Canvas Showcase",
  description: "A local whiteboard concept with drawing, notes, undo, and PNG export.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
