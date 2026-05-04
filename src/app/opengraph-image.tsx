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
            "radial-gradient(120% 80% at 100% 0%, rgba(245,184,65,0.35) 0%, transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(14,122,95,0.45) 0%, transparent 60%), linear-gradient(180deg, #0b1f33 0%, #07111d 100%)",
          color: "#f8faf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#f5b841",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 600 }}>DoubleA</span>
            <span
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Solar Solutions
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
