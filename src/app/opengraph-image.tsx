import { ImageResponse } from "next/og";
export const alt = "Winglo Cleaning Services — Interactive demo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 12 }}>WINGLO</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 68, letterSpacing: -3 }}>A fresh start, every day.</div>
        <div style={{ fontSize: 28, color: "dimgray" }}>Cleaning Services Management</div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "dimgray" }}>
        Demo Data · Sample Estimates · No Messages Sent
      </div>
    </div>,
    size,
  );
}
