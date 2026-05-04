import { NextResponse } from "next/server";

import { geocodeAddress } from "@/lib/sonnendach/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (q.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await geocodeAddress(q);
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch (e) {
    console.error("[geocode] error", e);
    return NextResponse.json(
      { error: "Geocoding fehlgeschlagen." },
      { status: 502 },
    );
  }
}
