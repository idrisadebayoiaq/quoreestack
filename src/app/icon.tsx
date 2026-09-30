import { ImageResponse } from "next/og";
import { GEAR_PATH } from "@/components/ui/Gear";

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
          background: "#0d0f12",
          borderRadius: 12,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 100 100">
          <path d={GEAR_PATH} fill="#ff6a13" fillRule="evenodd" />
        </svg>
      </div>
    ),
    size,
  );
}
