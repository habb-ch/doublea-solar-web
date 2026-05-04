import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = `${siteConfig.name} – Photovoltaik & Solaranlagen Schweiz`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(245,184,65,0.35) 0%, transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(181,216,108,0.45) 0%, transparent 60%), linear-gradient(180deg, #0b1f33 0%, #07111d 100%)",
          color: "#f8faf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg
            width="68"
            height="68"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ogSun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7C84A" />
                <stop offset="55%" stopColor="#F5982F" />
                <stop offset="100%" stopColor="#F26B25" />
              </linearGradient>
              <linearGradient id="ogPanel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C7E37A" />
                <stop offset="100%" stopColor="#A8CC60" />
              </linearGradient>
            </defs>
            <path d="M14 50 L31 12 L34 12 L19 50 Z" fill="url(#ogSun)" />
            <path d="M30 28 L57 12 L51.5 28 Z" fill="url(#ogPanel)" />
            <path d="M24 50 L30 28 L51.5 28 L45.5 50 Z" fill="url(#ogPanel)" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 600 }}>DoubleA Solar</span>
            <span
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Solutions
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 980,
            }}
          >
            Solarenergie für Schweizer Dächer – präzise geplant, sauber umgesetzt.
          </div>
          <div style={{ fontSize: 24, opacity: 0.78, maxWidth: 940 }}>
            Photovoltaikplanung, Förderberatung, Installation und Wartung – persönlich
            aus Grenchen, schweizweit umgesetzt.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            opacity: 0.7,
          }}
        >
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span>Grenchen · Schweiz</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
