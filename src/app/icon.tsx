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
          background: "#0b1f33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconSun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7C84A" />
              <stop offset="100%" stopColor="#F26B25" />
            </linearGradient>
            <linearGradient id="iconPanel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C7E37A" />
              <stop offset="100%" stopColor="#A8CC60" />
            </linearGradient>
          </defs>
          <path d="M14 50 L31 12 L34 12 L19 50 Z" fill="url(#iconSun)" />
          <path d="M30 28 L57 12 L51.5 28 Z" fill="url(#iconPanel)" />
          <path d="M24 50 L30 28 L51.5 28 L45.5 50 Z" fill="url(#iconPanel)" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
