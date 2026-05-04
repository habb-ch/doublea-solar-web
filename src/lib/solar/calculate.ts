import { getCanton, type CantonCode } from "./canton-data";

export type BuildingType =
  | "einfamilienhaus"
  | "mehrfamilienhaus"
  | "gewerbe"
  | "landwirtschaft"
  | "sonstiges";

export type Orientation =
  | "sued"
  | "suedost"
  | "suedwest"
  | "ost"
  | "west"
  | "flachdach"
  | "gemischt";

export type TiltBucket = "0-10" | "10-25" | "25-40" | "40+";

export type Shading = "keine" | "leicht" | "mittel" | "stark";

export type WantsBattery = "ja" | "nein" | "unsicher";

export type FinancingInterest = "ja" | "nein" | "unsicher";

export type SolarCalculatorInput = {
  buildingType: BuildingType;
  canton: CantonCode | string;
  postalCode?: string;
  city?: string;
  roofAreaM2: number;
  usableRoofPercent: number;
  orientation: Orientation;
  tilt: TiltBucket;
  shading: Shading;
  annualConsumptionKwh: number;
  hasHeatPump: boolean;
  hasEv: boolean;
  wantsBattery: WantsBattery;
  electricityPriceRappen?: number;
  feedInTariffRappen?: number;
  financingInterest?: FinancingInterest;
};

export type SolarCalculatorResult = {
  usableAreaM2: number;
  recommendedKwp: number;
  annualProductionKwh: { conservative: number; realistic: number; optimistic: number };
  recommendedBatteryKwh: number;
  selfConsumptionShare: number;
  selfConsumedKwh: number;
  fedInKwh: number;
  annualSavingsChf: { conservative: number; realistic: number; optimistic: number };
  investmentChf: { low: number; high: number };
  paybackYears: { fast: number; slow: number };
  estimatedSubsidyRangeChf: { low: number; high: number };
  co2SavedKgPerYear: number;
  recommendation: {
    battery: "empfohlen" | "optional" | "nicht-empfohlen";
    sizing: string;
    notes: string[];
  };
  factors: {
    orientation: number;
    tilt: number;
    shading: number;
    specificYield: number;
  };
  disclaimers: string[];
};

const orientationFactor: Record<Orientation, number> = {
  sued: 1.0,
  suedost: 0.95,
  suedwest: 0.95,
  ost: 0.85,
  west: 0.85,
  flachdach: 0.92,
  gemischt: 0.9,
};

const tiltFactor: Record<TiltBucket, number> = {
  "0-10": 0.9,
  "10-25": 0.96,
  "25-40": 1.0,
  "40+": 0.94,
};

const shadingFactor: Record<Shading, number> = {
  keine: 1.0,
  leicht: 0.92,
  mittel: 0.78,
  stark: 0.6,
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function round(n: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Schätzt den realistisch erreichbaren Eigenverbrauchsanteil basierend auf
 * Verbrauch, Anlagengrösse, Batterie und elektrischen Lasten (WP, EV).
 */
function estimateSelfConsumptionShare(args: {
  productionKwh: number;
  consumptionKwh: number;
  hasBattery: boolean;
  hasHeatPump: boolean;
  hasEv: boolean;
}): number {
  const { productionKwh, consumptionKwh, hasBattery, hasHeatPump, hasEv } = args;
  const ratio = productionKwh / Math.max(consumptionKwh, 1);

  let base = hasBattery ? 0.6 : 0.32;
  if (hasBattery) {
    if (ratio < 1.1) base = 0.7;
    else if (ratio > 1.6) base = 0.55;
  } else {
    if (ratio < 0.8) base = 0.4;
    else if (ratio > 1.5) base = 0.28;
  }

  if (hasHeatPump) base += 0.05;
  if (hasEv) base += 0.05;

  return clamp(base, 0.25, 0.78);
}

function pricePerKwpRange(kwp: number): { low: number; high: number } {
  if (kwp <= 12) return { low: 2300, high: 3300 };
  if (kwp >= 30) return { low: 1800, high: 2600 };
  // Linear interpolation für 12–30 kWp
  const t = (kwp - 12) / (30 - 12);
  return {
    low: round(2300 - t * (2300 - 1800)),
    high: round(3300 - t * (3300 - 2600)),
  };
}

/**
 * Hauptberechnung. Gibt Spannen ("Range") zurück, weil eine seriöse
 * Erstschätzung ohne Standortbegehung keine Punktwerte liefern kann.
 */
export function calculateSolar(input: SolarCalculatorInput): SolarCalculatorResult {
  const usablePercent = clamp(input.usableRoofPercent, 30, 100) / 100;
  const usableAreaM2 = round(input.roofAreaM2 * usablePercent, 1);

  // 1 kWp benötigt grob ~5 m² nutzbare Modulfläche (ca. 200 W/m²).
  const recommendedKwp = round(usableAreaM2 / 5, 1);

  const canton = getCanton(input.canton);
  const specificYield = canton?.specificYield ?? 1000;

  const fO = orientationFactor[input.orientation];
  const fT = tiltFactor[input.tilt];
  const fS = shadingFactor[input.shading];

  // Variante A: Pauschal über nutzbare Dachfläche (~200 kWh/m²/Jahr Mittelland).
  const yieldArea = usableAreaM2 * 200 * fO * fT * fS;
  // Variante B: kWp * spezifischer Ertrag pro Kanton.
  const yieldKwp = recommendedKwp * specificYield * fO * fT * fS;
  // Plausibilisierter Mittelwert.
  const realistic = round((yieldArea + yieldKwp) / 2);
  const conservative = round(realistic * 0.88);
  const optimistic = round(realistic * 1.08);

  const wantsBattery = input.wantsBattery === "ja";
  const recommendedBatteryKwh = wantsBattery
    ? clamp(round(input.annualConsumptionKwh / 1000), 5, 20)
    : 0;

  const selfConsumptionShare = estimateSelfConsumptionShare({
    productionKwh: realistic,
    consumptionKwh: input.annualConsumptionKwh,
    hasBattery: wantsBattery,
    hasHeatPump: input.hasHeatPump,
    hasEv: input.hasEv,
  });

  const directlyUsable = Math.min(realistic, input.annualConsumptionKwh);
  const selfConsumedKwh = round(directlyUsable * selfConsumptionShare);
  const fedInKwh = Math.max(0, round(realistic - selfConsumedKwh));

  const electricityPrice = (input.electricityPriceRappen ?? 30) / 100;
  const feedInTariff = (input.feedInTariffRappen ?? 10) / 100;

  function savings(production: number): number {
    const sc = round(Math.min(production, input.annualConsumptionKwh) * selfConsumptionShare);
    const fi = Math.max(0, production - sc);
    return round(sc * electricityPrice + fi * feedInTariff);
  }

  const annualSavingsChf = {
    conservative: savings(conservative),
    realistic: savings(realistic),
    optimistic: savings(optimistic),
  };

  const pvPriceRange = pricePerKwpRange(recommendedKwp);
  const batteryLow = recommendedBatteryKwh * 700;
  const batteryHigh = recommendedBatteryKwh * 1200;
  const investmentChf = {
    low: round(recommendedKwp * pvPriceRange.low + batteryLow),
    high: round(recommendedKwp * pvPriceRange.high + batteryHigh),
  };

  // Konservative, unverbindliche Förderspanne (Pronovo EIV grobe Indikation).
  const subsidyLow = round(clamp(recommendedKwp, 0, 100) * 280);
  const subsidyHigh = round(clamp(recommendedKwp, 0, 100) * 460);

  const investNetLow = Math.max(0, investmentChf.low - subsidyHigh);
  const investNetHigh = Math.max(0, investmentChf.high - subsidyLow);
  const paybackYears = {
    fast: round(investNetLow / Math.max(annualSavingsChf.optimistic, 1), 1),
    slow: round(investNetHigh / Math.max(annualSavingsChf.conservative, 1), 1),
  };

  // CO2-Faktor Schweiz-Mix grob ~0.12 kg/kWh; substituierter Strom konservativ.
  const co2SavedKgPerYear = round(realistic * 0.12);

  const notes: string[] = [];
  if (input.hasHeatPump) {
    notes.push(
      "Mit einer Wärmepumpe lohnt sich oft eine grosszügigere Auslegung und ein Speicher zur besseren Eigenverbrauchsdeckung.",
    );
  }
  if (input.hasEv) {
    notes.push(
      "Mit Elektroauto empfehlen wir eine Wallbox mit PV-Überschuss-Steuerung, um den Eigenverbrauch zu maximieren.",
    );
  }
  if (input.shading === "stark") {
    notes.push(
      "Starke Verschattung reduziert den Ertrag deutlich. Eine Vor-Ort-Analyse mit Verschattungssimulation ist empfohlen.",
    );
  }
  if (input.orientation === "ost" || input.orientation === "west") {
    notes.push(
      "Reine Ost-/Westausrichtung liefert einen breiteren Tagesertrag und passt gut zu hohem Eigenverbrauch.",
    );
  }

  let battery: "empfohlen" | "optional" | "nicht-empfohlen" = "optional";
  if (input.wantsBattery === "ja") battery = "empfohlen";
  else if (input.wantsBattery === "nein") battery = "nicht-empfohlen";
  else if (input.hasHeatPump || input.hasEv) battery = "empfohlen";

  return {
    usableAreaM2,
    recommendedKwp,
    annualProductionKwh: { conservative, realistic, optimistic },
    recommendedBatteryKwh,
    selfConsumptionShare: round(selfConsumptionShare * 100) / 100,
    selfConsumedKwh,
    fedInKwh,
    annualSavingsChf,
    investmentChf,
    paybackYears,
    estimatedSubsidyRangeChf: { low: subsidyLow, high: subsidyHigh },
    co2SavedKgPerYear,
    recommendation: {
      battery,
      sizing: `${recommendedKwp} kWp auf ca. ${usableAreaM2} m² nutzbarer Dachfläche`,
      notes,
    },
    factors: {
      orientation: fO,
      tilt: fT,
      shading: fS,
      specificYield,
    },
    disclaimers: [
      "Diese Auswertung ist eine fundierte Erstschätzung und ersetzt keine technische Standortanalyse.",
      "Mögliche Förderungen (z. B. Pronovo EIV) müssen tagesaktuell geprüft werden und sind nicht garantiert.",
      "Investitionsspannen sind Schweizer Marktrichtwerte und keine verbindliche Offerte.",
    ],
  };
}
