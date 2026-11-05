import { ImageResponse } from "next/og";

export const alt = "Waleed Ilyas portfolio — independent project showcases";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "76px 84px",
        color: "#f5f5f7",
        background: "#0a0a0f",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ width: 740, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a5f3d5",
            fontSize: 24,
            letterSpacing: 5,
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #70dcb6",
              borderRadius: 12,
              fontSize: 19,
            }}
          >
            WI
          </span>
          SELECTED SHOWCASES
        </div>
        <div
          style={{
            marginTop: 62,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -4,
          }}
        >
          Waleed Ilyas
        </div>
        <div style={{ marginTop: 18, color: "#a5f3d5", fontSize: 38, lineHeight: 1.2 }}>
          Selected project showcases · built to explore
        </div>
        <div style={{ marginTop: 36, color: "#9696a8", fontSize: 20 }}>
          New portfolio projects · local demos
        </div>
      </div>
      <div
        style={{
          width: 235,
          height: 235,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #7064bd",
          borderRadius: "50%",
          boxShadow: "0 0 0 22px #7064bd18, 0 0 0 48px #00d9ff0b",
          color: "#c4bcff",
          fontSize: 64,
          fontFamily: "monospace",
        }}
      >
        MERN
      </div>
    </div>,
    size,
  );
}
