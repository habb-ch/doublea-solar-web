/**
 * Adress-Resultat von api3.geo.admin.ch SearchServer (Schweizer Bundes-Geocoder).
 */
export type GeocodeResult = {
  label: string;
  street: string;
  postalCode: string;
  city: string;
  canton: string | null;
  lat: number;
  lon: number;
  egid: string | null;
};

/**
 * Ein Dach-Segment aus dem Sonnendach.ch-Datensatz des Bundesamts für Energie.
 * Werte stammen aus `ch.bfe.solarenergie-eignung-daecher` und basieren auf
 * Modellrechnungen mit Schweizer Strahlungsdaten und 3D-Gebäudemodellen.
 */
export type SonnendachSegment = {
  id: number;
  buildingId: number;
  gwrEgid: string | null;
  segmentNr: number;
  /** Dachfläche brutto in m². */
  areaM2: number;
  /** Nutzbare Kollektorfläche in m² (BFE-bereinigt um Hindernisse). */
  usableAreaM2: number;
  /** Ausrichtung in Grad: 0 = Süd, ±90 = Ost/West, ±180 = Nord, Flachdach: ±180 mit Neigung 0. */
  orientationDeg: number;
  /** Neigung in Grad. */
  tiltDeg: number;
  /** Spezifische Einstrahlung kWh/m²/Jahr (mstrahlung). */
  specificIrradiationKwhM2Year: number;
  /** Gesamteinstrahlung auf das Segment kWh/Jahr (gstrahlung). */
  totalIrradiationKwhYear: number;
  /** BFE-modellierter Stromertrag kWh/Jahr für dieses Segment. */
  electricityYieldKwhYear: number;
  /** Eignungsklasse 1 (gering) bis 5 (hervorragend). */
  suitabilityClass: 1 | 2 | 3 | 4 | 5;
  suitabilityLabel: string;
};

/**
 * Gruppierung der Segmente nach Gebäude (gleiche `building_id`).
 */
export type SonnendachBuilding = {
  buildingId: number;
  gwrEgid: string | null;
  segments: SonnendachSegment[];
  totalAreaM2: number;
  totalUsableAreaM2: number;
  totalElectricityYieldKwhYear: number;
  averageSuitabilityClass: number;
  /** Distanz vom Suchpunkt zur nächsten Segmentmitte (m), grob. */
  approxDistanceM?: number;
};

export type SonnendachQueryResult = {
  buildings: SonnendachBuilding[];
  /** True wenn die API eine Antwort gab, aber für diesen Punkt keine Daten existieren. */
  empty: boolean;
};
