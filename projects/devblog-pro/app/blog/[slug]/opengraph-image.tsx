import { ImageResponse } from "next/og";
import { getArticleSummary } from "@/lib/articles";

export const alt = "DevBlog Pro article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleSummary(slug);
  const title = article?.title ?? "Product Engineering Notes";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f4f2ec",
        color: "#21221f",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 5, color: "#77786f" }}>
        DEVBLOG PRO / FIELD NOTES
      </div>
      <div style={{ maxWidth: 960, fontSize: 72, lineHeight: 1.12, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 24, color: "#77786f" }}>
        Independent sample publication · {article?.category ?? "Engineering"}
      </div>
    </div>,
    size,
  );
}
