/**
 * Konservative Richtwerte für den spezifischen Jahresertrag (kWh/kWp/Jahr)
 * pro Schweizer Kanton. Werte sind Mittelland-/Höhenlagen-Schätzungen und
 * dienen ausschliesslich als Erstindikation. Verbindliche Werte ergeben
 * sich erst aus einer Standortanalyse vor Ort.
 *
 * Quellen-orientiert an publizierten Spannweiten von ca. 900–1'150 kWh/kWp
 * für Schweizer Standorte (Plateau bis Alpenrand).
 */
export type CantonCode =
  | "AG" | "AI" | "AR" | "BE" | "BL" | "BS" | "FR" | "GE" | "GL"
  | "GR" | "JU" | "LU" | "NE" | "NW" | "OW" | "SG" | "SH" | "SO"
  | "SZ" | "TG" | "TI" | "UR" | "VD" | "VS" | "ZG" | "ZH";

export type CantonInfo = {
  code: CantonCode;
  name: string;
  /** Konservativer spezifischer Ertrag in kWh/kWp/Jahr (Süd, optimal). */
  specificYield: number;
};

export const cantons: ReadonlyArray<CantonInfo> = [
  { code: "AG", name: "Aargau", specificYield: 1010 },
  { code: "AI", name: "Appenzell Innerrhoden", specificYield: 1020 },
  { code: "AR", name: "Appenzell Ausserrhoden", specificYield: 1010 },
  { code: "BE", name: "Bern", specificYield: 1000 },
  { code: "BL", name: "Basel-Landschaft", specificYield: 1010 },
  { code: "BS", name: "Basel-Stadt", specificYield: 1000 },
  { code: "FR", name: "Freiburg", specificYield: 1010 },
  { code: "GE", name: "Genf", specificYield: 1080 },
  { code: "GL", name: "Glarus", specificYield: 1020 },
  { code: "GR", name: "Graubünden", specificYield: 1130 },
  { code: "JU", name: "Jura", specificYield: 980 },
  { code: "LU", name: "Luzern", specificYield: 1000 },
  { code: "NE", name: "Neuenburg", specificYield: 1000 },
  { code: "NW", name: "Nidwalden", specificYield: 1010 },
  { code: "OW", name: "Obwalden", specificYield: 1020 },
  { code: "SG", name: "St. Gallen", specificYield: 1010 },
  { code: "SH", name: "Schaffhausen", specificYield: 1000 },
  { code: "SO", name: "Solothurn", specificYield: 1010 },
  { code: "SZ", name: "Schwyz", specificYield: 1020 },
  { code: "TG", name: "Thurgau", specificYield: 1000 },
  { code: "TI", name: "Tessin", specificYield: 1150 },
  { code: "UR", name: "Uri", specificYield: 1050 },
  { code: "VD", name: "Waadt", specificYield: 1060 },
  { code: "VS", name: "Wallis", specificYield: 1130 },
  { code: "ZG", name: "Zug", specificYield: 1010 },
  { code: "ZH", name: "Zürich", specificYield: 1010 },
] as const;

const cantonMap = new Map(cantons.map((c) => [c.code, c]));

export function getCanton(code: string | undefined | null): CantonInfo | null {
  if (!code) return null;
  return cantonMap.get(code.toUpperCase() as CantonCode) ?? null;
}

export const cantonCodes: ReadonlyArray<CantonCode> = cantons.map((c) => c.code);
