import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          gap: 0,
        }}
      >
        <div style={{ fontSize: 60, lineHeight: 1 }}>🥝</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#22c55e", lineHeight: 1 }}>K</div>
      </div>
    ),
    { ...size }
  );
}
