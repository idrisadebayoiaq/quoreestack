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
          color: "#3d8bff",
          background: "#06080f",
          border: "3px solid #3d8bff",
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
