import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "SocialSphere — Community Feed Showcase",
  description: "A responsive community feed concept with local-only demo interactions.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
