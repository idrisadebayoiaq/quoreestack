import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1ad4a8",
          background: "#070b12",
          border: "3px solid #1ad4a8",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-1px",
        }}
      >
        QS
      </div>
    ),
    size,
  );
}
