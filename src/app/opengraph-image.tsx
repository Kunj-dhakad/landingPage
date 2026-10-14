import { ImageResponse } from "next/og";
export const alt = "NavoNixx — Work smarter. Create faster. Grow with AI.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#030611",
        padding: "65px 80px",
        flexDirection: "column",
        color: "#f5f8ff",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 34,
          fontWeight: 700,
          marginBottom: 55,
        }}
      >
        navonixx<span style={{ color: "#0066ff" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.12,
        }}
      >
        Work smarter.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.12,
        }}
      >
        Create faster.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.12,
          color: "#0066ff",
        }}
      >
        Grow with AI.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 23,
          color: "#a4b1cb",
          marginTop: 35,
        }}
      >
        Free tools. Smarter work. Unlimited possibilities.
      </div>
    </div>,
    size,
  );
}
