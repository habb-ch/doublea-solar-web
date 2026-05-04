import { NextResponse } from "next/server";

import { lookupRoofs } from "@/lib/sonnendach/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Ungültige lat/lon-Parameter." },
      { status: 400 },
    );
  }
  if (lat < 45 || lat > 48 || lon < 5 || lon > 11) {
    return NextResponse.json(
      { error: "Koordinaten ausserhalb der Schweiz." },
      { status: 400 },
    );
  }

  try {
    const result = await lookupRoofs(lat, lon);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("[sonnendach] error", e);
    return NextResponse.json(
      { error: "Sonnendach-Abfrage fehlgeschlagen." },
      { status: 502 },
    );
  }
}
