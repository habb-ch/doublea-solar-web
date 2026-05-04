import "server-only";

import type {
  GeocodeResult,
  SonnendachBuilding,
  SonnendachQueryResult,
  SonnendachSegment,
} from "./types";

const GEOCODE_BASE = "https://api3.geo.admin.ch/rest/services/api/SearchServer";
const IDENTIFY_BASE = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify";
const SOLAR_LAYER = "ch.bfe.solarenergie-eignung-daecher";

const FETCH_OPTS = {
  // Eintägiges Caching auf Edge: Sonnendach-Daten ändern sich nur selten.
  next: { revalidate: 86400 },
  headers: {
    "User-Agent": "DoubleASolarSolutions/1.0 (+https://www.doubleasolutions.ch)",
  },
} as const;

type SearchServerAttrs = {
  label: string;
  detail: string;
  lat: number;
  lon: number;
  origin: string;
  links?: { href: string; rel: string; title: string }[];
};

type IdentifyResponse = {
  results: Array<{
    layerBodId: string;
    featureId: number | string;
    properties?: Record<string, unknown>;
  }>;
};

/**
 * Strippt HTML-Tags aus einem geocoder-Label und gibt den Klartext zurück.
 */
function stripLabel(label: string): string {
  return label.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Parst das `detail`-Feld der SearchServer-Antwort in Bestandteile.
 * Beispiel-Detail: "oelirain 1a 2540 grenchen 2546 grenchen ch so"
 */
function parseDetail(detail: string): {
  street?: string;
  postalCode?: string;
  city?: string;
  canton?: string;
} {
  // Letzte 2 Tokens sind häufig "ch <kanton>"
  const tokens = detail.split(/\s+/);
  let canton: string | undefined;
  if (tokens.length >= 2 && tokens[tokens.length - 2] === "ch") {
    canton = tokens[tokens.length - 1]?.toUpperCase();
  }

  // Postleitzahl finden (4-stellige Zahl)
  const plzMatch = detail.match(/\b(\d{4})\b/);
  const postalCode = plzMatch?.[1];

  // Alles vor der PLZ ist die Strasse, alles dazwischen bis "ch" ist die Stadt
  let street: string | undefined;
  let city: string | undefined;
  if (postalCode) {
    const parts = detail.split(postalCode);
    street = parts[0]?.trim();
    const cityPart = parts[1]?.trim();
    if (cityPart) {
      // Entferne Wiederholungen wie "grenchen 2546 grenchen ch so"
      const cleaned = cityPart
        .replace(/\b\d{4}\b/g, "")
        .replace(/\s+ch\s+[a-z]{2}\s*$/i, "")
        .trim();
      // Nimm nur das erste Wort/die ersten Wörter ohne Wiederholungen
      const words = cleaned.split(/\s+/);
      const dedup: string[] = [];
      for (const w of words) {
        if (!dedup.includes(w.toLowerCase())) {
          dedup.push(w);
          if (dedup.length >= 3) break;
        }
      }
      city = dedup
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  if (street) {
    street = street
      .split(/\s+/)
      .map((w) =>
        /^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
      )
      .join(" ");
  }

  return { street, postalCode, city, canton };
}

function extractEgid(links?: SearchServerAttrs["links"]): string | null {
  const gwrLink = links?.find((l) => l.title === "ch.bfs.gebaeude_wohnungs_register");
  if (!gwrLink) return null;
  const match = gwrLink.href.match(/(\d+)_\d+$/);
  return match?.[1] ?? null;
}

/**
 * Sucht Adressen über den Schweizer Bundes-Geocoder.
 * Limit ist niedrig gewählt — wir wollen relevante Treffer, nicht eine Long Tail.
 */
export async function geocodeAddress(query: string, limit = 6): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  const url = `${GEOCODE_BASE}?type=locations&origins=address&searchText=${encodeURIComponent(
    trimmed,
  )}&limit=${limit}&sr=4326`;
  const res = await fetch(url, FETCH_OPTS);
  if (!res.ok) {
    console.warn("[geocode] non-2xx", res.status);
    return [];
  }
  const data = (await res.json()) as { results?: { attrs?: SearchServerAttrs }[] };
  const results = data.results ?? [];
  return results
    .map((r) => r.attrs)
    .filter((a): a is SearchServerAttrs => Boolean(a))
    .map((attrs) => {
      const parsed = parseDetail(attrs.detail);
      return {
        label: stripLabel(attrs.label),
        street: parsed.street ?? "",
        postalCode: parsed.postalCode ?? "",
        city: parsed.city ?? "",
        canton: parsed.canton ?? null,
        lat: attrs.lat,
        lon: attrs.lon,
        egid: extractEgid(attrs.links),
      } satisfies GeocodeResult;
    });
}

function parseSuitabilityClass(v: unknown): SonnendachSegment["suitabilityClass"] {
  const n = Number(v);
  if (n >= 1 && n <= 5) return n as SonnendachSegment["suitabilityClass"];
  return 1;
}

function parseSuitabilityLabel(v: unknown): string {
  if (typeof v !== "string") return "";
  // BFE liefert mehrsprachig: "Sehr gut##Trés bonne##Molto buona##Very good##Sehr gut"
  return v.split("##")[0]?.trim() ?? "";
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toSegment(featureId: number | string, props: Record<string, unknown>): SonnendachSegment {
  return {
    id: typeof featureId === "number" ? featureId : Number(featureId) || 0,
    buildingId: num(props.building_id),
    gwrEgid: props.gwr_egid ? String(props.gwr_egid) : null,
    segmentNr: num(props.df_nummer),
    areaM2: num(props.flaeche),
    usableAreaM2: num(props.flaeche_kollektoren),
    orientationDeg: num(props.ausrichtung),
    tiltDeg: num(props.neigung),
    specificIrradiationKwhM2Year: num(props.mstrahlung),
    totalIrradiationKwhYear: num(props.gstrahlung),
    electricityYieldKwhYear: num(props.stromertrag),
    suitabilityClass: parseSuitabilityClass(props.klasse),
    suitabilityLabel: parseSuitabilityLabel(props.klasse_text),
  };
}

/**
 * Holt alle Dachsegmente in der Umgebung des Punkts (WGS84). Die Identify-API
 * benötigt eine sinnvolle Map-Ausdehnung mit Pixel-Auflösung – wir nutzen
 * eine fixe ~1km-Box mit 2400×1500 px und Toleranz 50 px, was ungefähr
 * einer effektiven Suchtoleranz von ~16 m entspricht. Die Ergebnisse werden
 * danach nach Distanz vom Suchpunkt sortiert; der Aufrufer kann die
 * relevanten Gebäude über `building_id` gruppieren.
 */
export async function fetchRoofSegments(
  lat: number,
  lon: number,
): Promise<SonnendachSegment[]> {
  // Fixe ~1km × 700m Ausdehnung um den Punkt herum.
  const halfLat = 0.005; // ~555 m
  const halfLon = 0.005; // ~380 m bei 47°N
  const minLat = lat - halfLat;
  const maxLat = lat + halfLat;
  const minLon = lon - halfLon;
  const maxLon = lon + halfLon;

  const url =
    `${IDENTIFY_BASE}?layers=all:${SOLAR_LAYER}` +
    `&geometry=${lon},${lat}` +
    `&geometryType=esriGeometryPoint` +
    `&geometryFormat=geojson` +
    `&imageDisplay=2400,1500,96` +
    `&mapExtent=${minLon},${minLat},${maxLon},${maxLat}` +
    `&tolerance=50&sr=4326&returnGeometry=false&limit=30`;
  const res = await fetch(url, FETCH_OPTS);
  if (!res.ok) {
    console.warn("[sonnendach] non-2xx", res.status);
    return [];
  }
  const data = (await res.json()) as IdentifyResponse;
  return (data.results ?? [])
    .filter((r) => r.layerBodId === SOLAR_LAYER && r.properties)
    .map((r) => toSegment(r.featureId, r.properties as Record<string, unknown>));
}

/**
 * Gruppiert Segmente nach `building_id`, sortiert nach Stromertrag absteigend
 * (das ertragsstärkste Gebäude steht oben — meistens das Hauptgebäude).
 */
export function groupByBuilding(segments: SonnendachSegment[]): SonnendachBuilding[] {
  const map = new Map<number, SonnendachSegment[]>();
  for (const s of segments) {
    if (!s.buildingId) continue;
    if (!map.has(s.buildingId)) map.set(s.buildingId, []);
    map.get(s.buildingId)!.push(s);
  }

  const buildings: SonnendachBuilding[] = [];
  for (const [buildingId, segs] of map) {
    const totalAreaM2 = segs.reduce((sum, s) => sum + s.areaM2, 0);
    const totalUsableAreaM2 = segs.reduce((sum, s) => sum + s.usableAreaM2, 0);
    const totalElectricityYieldKwhYear = segs.reduce(
      (sum, s) => sum + s.electricityYieldKwhYear,
      0,
    );
    const avgClass =
      segs.reduce((sum, s) => sum + s.suitabilityClass * s.areaM2, 0) /
      Math.max(totalAreaM2, 1);
    buildings.push({
      buildingId,
      gwrEgid: segs.find((s) => s.gwrEgid)?.gwrEgid ?? null,
      segments: segs.sort((a, b) => b.areaM2 - a.areaM2),
      totalAreaM2: Math.round(totalAreaM2 * 10) / 10,
      totalUsableAreaM2: Math.round(totalUsableAreaM2 * 10) / 10,
      totalElectricityYieldKwhYear: Math.round(totalElectricityYieldKwhYear),
      averageSuitabilityClass: Math.round(avgClass * 10) / 10,
    });
  }

  return buildings.sort(
    (a, b) => b.totalElectricityYieldKwhYear - a.totalElectricityYieldKwhYear,
  );
}

export async function lookupRoofs(
  lat: number,
  lon: number,
): Promise<SonnendachQueryResult> {
  const segments = await fetchRoofSegments(lat, lon);
  const buildings = groupByBuilding(segments);
  return { buildings, empty: buildings.length === 0 };
}
