import { ImageResponse } from "next/og";
export const alt = "NOREVA Insights — Analytics & Intelligence. Fictional concept by paceIT.";
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
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 12 }}>NOREVA</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 68, letterSpacing: -3 }}>A clearer view of your growth.</div>
        <div style={{ fontSize: 28, color: "dimgray" }}>Insights · Analytics & Intelligence</div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "dimgray" }}>Fictional concept · Built by paceIT</div>
    </div>,
    size,
  );
}
