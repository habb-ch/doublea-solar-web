"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Coins,
  LineChart as LineChartIcon,
  Sparkles,
  Sun,
  TreePine,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  formatChf,
  formatChfRange,
  formatKwh,
  formatKwp,
  formatPercent,
  formatYearsRange,
} from "@/lib/solar/format";
import type { SolarCalculatorResult } from "@/lib/solar/calculate";
import { SavingsChart } from "./savings-chart";
import { LeadForm } from "@/components/forms/lead-form";

type Props = {
  result: SolarCalculatorResult;
  onReset: () => void;
};

export function CalculatorResultCard({ result, onReset }: Props) {
  const reduce = useReducedMotion();
  const stats = [
    {
      icon: Sun,
      label: "Empfohlene Anlage",
      value: formatKwp(result.recommendedKwp),
      hint: `auf ca. ${result.usableAreaM2} m² Dachfläche`,
    },
    {
      icon: Zap,
      label: "Jahresproduktion",
      value: formatKwh(result.annualProductionKwh.realistic),
      hint: `Spanne ${formatKwh(result.annualProductionKwh.conservative)} – ${formatKwh(result.annualProductionKwh.optimistic)}`,
    },
    {
      icon: LineChartIcon,
      label: "Eigenverbrauchsanteil",
      value: formatPercent(result.selfConsumptionShare),
      hint: `${formatKwh(result.selfConsumedKwh)} direkt genutzt`,
    },
    {
      icon: Coins,
      label: "Jährliche Ersparnis",
      value: formatChf(result.annualSavingsChf.realistic),
      hint: `Spanne ${formatChfRange(result.annualSavingsChf.conservative, result.annualSavingsChf.optimistic)}`,
    },
    {
      icon: BatteryCharging,
      label: "Investitionsspanne",
      value: formatChfRange(result.investmentChf.low, result.investmentChf.high),
      hint:
        result.recommendedBatteryKwh > 0
          ? `inkl. Speicher ca. ${result.recommendedBatteryKwh} kWh`
          : "ohne Batteriespeicher",
    },
    {
      icon: TreePine,
      label: "CO₂-Einsparung",
      value: `${new Intl.NumberFormat("de-CH").format(result.co2SavedKgPerYear)} kg/Jahr`,
      hint: "Indikativ, abhängig vom Strommix",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
      className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
    >
      <div className="surface-glass rounded-3xl p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
                Ihre Erstauswertung
              </p>
              {result.dataSource === "sonnendach" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--solar-emerald)]/40 bg-[color:var(--solar-emerald)]/10 px-2 py-0.5 text-[10px] font-medium text-[color:var(--solar-emerald)]">
                  <Sparkles className="size-3" />
                  Bundesdaten · sonnendach.ch
                </span>
              )}
            </div>
            <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {result.recommendation.sizing}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Amortisation indikativ in {formatYearsRange(result.paybackYears.fast, result.paybackYears.slow)}.
            </p>
          </div>
          <button
            onClick={onReset}
            className="ring-focus shrink-0 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Neu starten
          </button>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 0.04} reduce={!!reduce} />
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-foreground">
            Kumulierte Ersparnis über 25 Jahre
          </h3>
          <p className="text-xs text-muted-foreground">
            Lineare Hochrechnung auf Basis der realistischen Jahresersparnis.
            Ohne Strompreis-Anstieg.
          </p>
          <div className="mt-3">
            <SavingsChart
              annualSavings={result.annualSavingsChf.realistic}
              investment={(result.investmentChf.low + result.investmentChf.high) / 2}
            />
          </div>
        </div>

        {result.recommendation.notes.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[color:var(--solar-gold)]/40 bg-[color:var(--solar-gold)]/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--solar-navy)]">
              Hinweise zu Ihrer Konstellation
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
              {result.recommendation.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--solar-navy)]" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="mt-6 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          {result.disclaimers.map((d) => (
            <li key={d}>· {d}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/8 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--solar-emerald)]">
            Empfehlung Batterie
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">
            {result.recommendation.battery === "empfohlen"
              ? "Speicher empfohlen"
              : result.recommendation.battery === "nicht-empfohlen"
                ? "Speicher aktuell nicht prioritär"
                : "Speicher optional"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {result.recommendedBatteryKwh > 0
              ? `Indikative Grösse: ${result.recommendedBatteryKwh} kWh`
              : "Wir prüfen den Mehrwert in der persönlichen Analyse."}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_22px_60px_-40px_rgba(11,31,51,0.5)]">
          <h3 className="text-base font-semibold text-foreground">
            Persönliche Analyse anfordern
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Senden Sie uns Ihre Auswertung – wir bereiten ein massgeschneidertes
            Angebot mit Förderprüfung vor.
          </p>
          <div className="mt-4">
            <LeadForm
              source="solarrechner"
              context={{ result }}
              successCta={
                <a
                  href="/services"
                  className="ring-focus inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--solar-emerald)]"
                >
                  Unsere Leistungen ansehen <ArrowRight className="size-4" />
                </a>
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  hint,
  delay,
  reduce,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
  hint: string;
  delay: number;
  reduce: boolean;
}) {
  // Subtle count-up effect (just opacity for non-numeric values).
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), reduce ? 0 : delay * 1000);
    return () => clearTimeout(t);
  }, [delay, reduce]);

  return (
    <li
      className={`rounded-2xl border border-border/70 bg-background/60 p-4 transition-opacity ${shown ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4 text-[color:var(--solar-emerald)]" />
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </li>
  );
}
