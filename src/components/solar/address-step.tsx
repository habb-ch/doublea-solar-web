"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import type {
  GeocodeResult,
  SonnendachBuilding,
  SonnendachQueryResult,
  SonnendachSegment,
} from "@/lib/sonnendach/types";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

// MapLibre läuft nur im Browser, nicht im SSR.
const RoofMap = dynamic(
  () => import("./roof-map").then((m) => m.RoofMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

function MapSkeleton() {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-border bg-secondary/50 text-xs text-muted-foreground sm:h-80">
      Karte wird geladen …
    </div>
  );
}

export type AddressStepSelection = {
  address: GeocodeResult;
  building: SonnendachBuilding;
  selectedSegmentIds: number[];
};

type Props = {
  initialQuery?: string;
  onSelect: (selection: AddressStepSelection) => void;
  /** Optional: wird aufgerufen, wenn der User die aktuelle Sonnendach-Auswahl löscht. */
  onClear?: () => void;
};

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Default-Auswahl-Filter: nur Segmente, die für PV ernsthaft Sinn ergeben.
 * Klasse ≥ 3 (Gut, Sehr gut, Hervorragend) UND keine reine Nord-Ausrichtung.
 * Pure Nordflächen (135° bis 225°, also -135° bis 135° gespiegelt um Süd)
 * sowie sehr kleine Segmente (< 10 m²) werden nicht vorausgewählt.
 */
function isWorthSelecting(s: SonnendachSegment): boolean {
  if (s.suitabilityClass < 3) return false;
  if (s.areaM2 < 10) return false;
  // Bei Flachdach (tilt < 5°) ist die Ausrichtung egal.
  if (s.tiltDeg < 5) return true;
  // Sonnendach-Konvention: 0° = Süd, ±180° = Nord. Akzeptiere -135° bis +135°.
  const a = s.orientationDeg;
  if (a >= -135 && a <= 135) return true;
  return false;
}

function classToColor(klasse: number): string {
  if (klasse >= 4.5) return "bg-emerald-500/20 text-emerald-700 border-emerald-500/30";
  if (klasse >= 3.5) return "bg-emerald-500/15 text-emerald-700 border-emerald-500/25";
  if (klasse >= 2.5) return "bg-amber-500/15 text-amber-800 border-amber-500/25";
  return "bg-zinc-500/10 text-zinc-700 border-zinc-500/20";
}

function classLabel(klasse: number): string {
  if (klasse >= 4.5) return "Hervorragend";
  if (klasse >= 3.5) return "Sehr gut";
  if (klasse >= 2.5) return "Gut";
  if (klasse >= 1.5) return "Mittel";
  return "Gering";
}

export function AddressStep({ initialQuery = "", onSelect, onClear }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounced(query, 280);

  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<GeocodeResult | null>(null);
  const [roofs, setRoofs] = useState<SonnendachQueryResult | null>(null);
  const [loadingRoofs, setLoadingRoofs] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<Set<number>>(new Set());

  // Adress-Suche
  useEffect(() => {
    if (debouncedQuery.trim().length < 3 || selectedAddress) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setError(null);
    fetch(`/api/geocode?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((d: { results?: GeocodeResult[]; error?: string }) => {
        if (cancelled) return;
        if (d.error) setError(d.error);
        setResults(d.results ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Suche fehlgeschlagen");
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedAddress]);

  // Sonnendach-Lookup nach Adress-Auswahl
  useEffect(() => {
    if (!selectedAddress) {
      setRoofs(null);
      return;
    }
    let cancelled = false;
    setLoadingRoofs(true);
    setRoofs(null);
    fetch(
      `/api/sonnendach?lat=${selectedAddress.lat}&lon=${selectedAddress.lon}`,
    )
      .then((r) => r.json())
      .then((d: SonnendachQueryResult) => {
        if (cancelled) return;
        setRoofs(d);
        // Auto-Select des grössten Gebäudes (mit höchstem Stromertrag).
        // Default-Segmente: nur die wirklich PV-tauglichen (Klasse ≥ 3 = Gut+
        // und Orientierung nicht nach Norden), damit wir keine ungeeigneten
        // Flächen ungewollt mitziehen.
        if (d.buildings[0]) {
          setSelectedBuildingId(d.buildings[0].buildingId);
          setSelectedSegmentIds(
            new Set(
              d.buildings[0].segments
                .filter((s) => isWorthSelecting(s))
                .map((s) => s.id),
            ),
          );
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Sonnendach-Abfrage fehlgeschlagen");
      })
      .finally(() => {
        if (!cancelled) setLoadingRoofs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedAddress]);

  const selectedBuilding = useMemo(() => {
    return roofs?.buildings.find((b) => b.buildingId === selectedBuildingId) ?? null;
  }, [roofs, selectedBuildingId]);

  const selectedAggregate = useMemo(() => {
    if (!selectedBuilding) return null;
    const segs = selectedBuilding.segments.filter((s) =>
      selectedSegmentIds.has(s.id),
    );
    if (segs.length === 0) return null;
    const totalArea = segs.reduce((s, x) => s + x.areaM2, 0);
    const totalUsable = segs.reduce((s, x) => s + x.usableAreaM2, 0);
    const totalYield = segs.reduce((s, x) => s + x.electricityYieldKwhYear, 0);
    const weightedIrr =
      segs.reduce((s, x) => s + x.specificIrradiationKwhM2Year * x.areaM2, 0) /
      Math.max(totalArea, 1);
    const avgClass =
      segs.reduce((s, x) => s + x.suitabilityClass * x.areaM2, 0) /
      Math.max(totalArea, 1);
    return {
      totalAreaM2: Math.round(totalArea * 10) / 10,
      usableAreaM2: Math.round(totalUsable * 10) / 10,
      totalElectricityYieldKwhYear: Math.round(totalYield),
      weightedSpecificIrradiationKwhM2Year: Math.round(weightedIrr),
      averageSuitabilityClass: Math.round(avgClass * 10) / 10,
      segmentCount: segs.length,
    };
  }, [selectedBuilding, selectedSegmentIds]);

  function pickAddress(addr: GeocodeResult) {
    setSelectedAddress(addr);
    setQuery(addr.label);
    setResults([]);
  }

  function clearAddress() {
    setSelectedAddress(null);
    setRoofs(null);
    setSelectedBuildingId(null);
    setSelectedSegmentIds(new Set());
    onClear?.();
  }

  function toggleSegment(id: number) {
    setSelectedSegmentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectBuilding(b: SonnendachBuilding) {
    setSelectedBuildingId(b.buildingId);
    setSelectedSegmentIds(
      new Set(b.segments.filter((s) => isWorthSelecting(s)).map((s) => s.id)),
    );
  }

  // Auto-Apply: jede Änderung der Auswahl propagiert sofort an den Parent.
  // So muss der User keinen extra Confirm-Button drücken.
  useEffect(() => {
    if (!selectedAddress || !selectedBuilding) return;
    onSelect({
      address: selectedAddress,
      building: selectedBuilding,
      selectedSegmentIds: Array.from(selectedSegmentIds),
    });
    // onSelect bewusst nicht in Deps — würde bei Parent-Re-Renders zu Loop führen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress, selectedBuilding, selectedSegmentIds]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor="addr-search">
            Adresse Ihres Hauses (für präzise Bundesdaten)
          </FieldLabel>
          <FieldDescription>
            Mit Adresse holen wir die offiziellen Sonnendach.ch-Werte vom Bundesamt
            für Energie – Dachfläche, Ausrichtung und Einstrahlung pro Segment.
            Sie können den Schritt jederzeit überspringen.
          </FieldDescription>
          <div className="relative">
            <Input
              id="addr-search"
              autoComplete="off"
              placeholder="z. B. Oelirain 1A, 2540 Grenchen"
              value={query}
              onChange={(e) => {
                if (selectedAddress) clearAddress();
                setQuery(e.target.value);
              }}
              className="h-11 pl-10"
            />
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </Field>

        {/* Result-Liste */}
        {results.length > 0 && !selectedAddress && (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => pickAddress(r)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[color:var(--solar-emerald)]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {r.street || r.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.postalCode} {r.city}
                      {r.canton && ` · ${r.canton}`}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      {/* Sonnendach-Resultate */}
      {selectedAddress && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/5 px-4 py-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-[color:var(--solar-emerald)]" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedAddress.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAddress.canton && `Kanton ${selectedAddress.canton} · `}
                  Klick auf die Karte, falls ein anderes Gebäude gemeint ist
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearAddress}
              className="ring-focus rounded text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Adresse ändern
            </button>
          </div>

          <RoofMap
            lat={selectedAddress.lat}
            lon={selectedAddress.lon}
            showSonnendach
            onMapClick={(newLat, newLon) => {
              // Karten-Klick: nur die Koordinaten anpassen, Adress-Label
              // bleibt gleich. So kann der User ein Nachbar-/Hinterhaus
              // anwählen, dessen Adresse formal nicht im Geocoder steht.
              setSelectedAddress({
                ...selectedAddress,
                lat: newLat,
                lon: newLon,
              });
            }}
          />

          {loadingRoofs && (
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Lade Sonnendach-Daten von api3.geo.admin.ch …
            </div>
          )}

          {!loadingRoofs && roofs && roofs.empty && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-4 text-sm text-foreground">
              <p className="font-medium">Für diese Adresse sind keine Sonnendach-Daten verfügbar.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Das BFE-Sonnendach.ch-Register deckt nicht jedes Gebäude ab (z. B. Neubauten oder
                geschützte Lagen). Tragen Sie die Werte unten manuell ein.
              </p>
            </div>
          )}

          {selectedBuilding && selectedAggregate && (
            <div className="rounded-2xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/5 p-5">
              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-full bg-[color:var(--solar-emerald)]/20 text-[color:var(--solar-emerald)] flex items-center justify-center text-base font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Dach erkannt · {classLabel(selectedAggregate.averageSuitabilityClass)} geeignet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedAggregate.usableAreaM2.toFixed(0)} m² nutzbare Modulfläche · ca.{" "}
                    {Intl.NumberFormat("de-CH").format(selectedAggregate.totalElectricityYieldKwhYear)}{" "}
                    kWh Modellertrag pro Jahr · Datenquelle: BFE Sonnendach.ch
                  </p>
                </div>
              </div>

              <details className="mt-4 group">
                <summary className="ring-focus cursor-pointer rounded-md text-xs font-medium text-muted-foreground hover:text-foreground select-none">
                  Dachflächen einzeln anpassen ({selectedBuilding.segments.length} Segmente)
                </summary>
                <ul className="mt-3 grid gap-2">
                  {selectedBuilding.segments.map((s) => {
                    const checked = selectedSegmentIds.has(s.id);
                    return (
                      <li key={s.id}>
                        <SegmentRow
                          segment={s}
                          checked={checked}
                          onToggle={() => toggleSegment(s.id)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    );
  }
}

function SegmentRow({
  segment,
  checked,
  onToggle,
}: {
  segment: SonnendachSegment;
  checked: boolean;
  onToggle: () => void;
}) {
  function orientationLabel(deg: number, tilt: number): string {
    if (tilt < 5) return "Flachdach";
    const a = ((deg + 360) % 360);
    if (a >= 337.5 || a < 22.5) return "Süd";
    if (a < 67.5) return "Südwest";
    if (a < 112.5) return "West";
    if (a < 157.5) return "Nordwest";
    if (a < 202.5) return "Nord";
    if (a < 247.5) return "Nordost";
    if (a < 292.5) return "Ost";
    return "Südost";
  }

  return (
    <label
      className={cn(
        "ring-focus group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors",
        checked
          ? "border-[color:var(--solar-emerald)] bg-[color:var(--solar-emerald)]/5"
          : "border-border bg-background hover:bg-secondary",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 cursor-pointer accent-[color:var(--solar-emerald)]"
      />
      <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-sm font-medium text-foreground">
          Segment {segment.segmentNr} · {segment.areaM2.toFixed(0)} m²
        </span>
        <span className="text-xs text-muted-foreground">
          {orientationLabel(segment.orientationDeg, segment.tiltDeg)} ·{" "}
          {segment.tiltDeg}° Neigung ·{" "}
          {Intl.NumberFormat("de-CH").format(segment.specificIrradiationKwhM2Year)}{" "}
          kWh/m²/J
        </span>
        <span className="text-xs text-muted-foreground">
          → {Intl.NumberFormat("de-CH").format(segment.electricityYieldKwhYear)} kWh/J
        </span>
      </div>
      <span
        className={cn(
          "rounded-full border px-2 py-0.5 text-[10px] font-medium",
          classToColor(segment.suitabilityClass),
        )}
      >
        {classLabel(segment.suitabilityClass)}
      </span>
    </label>
  );
}
