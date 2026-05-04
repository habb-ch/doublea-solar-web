"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  "Anlagengrösse, Produktion und Eigenverbrauch in 60 Sekunden",
  "Investitionsspanne und indikative Amortisation",
  "Empfehlung mit oder ohne Batterie – ehrlich begründet",
  "Speicherung der Auswertung als Grundlage für Ihr Angebot",
];

export function SolarCalculatorSection() {
  const reduce = useReducedMotion();
  return (
    <section id="rechner" className="container-page py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduce ? 0 : 0.6 }}
        className="surface-glass relative overflow-hidden rounded-3xl"
      >
        <div className="grid gap-10 p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-14">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
              Solarrechner
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[44px]">
              Wie viel Solarpotenzial steckt in Ihrem Dach?
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Unser Rechner liefert eine fundierte Erstauswertung basierend auf
              kantonalem Ertrag, Ausrichtung, Verschattung und Verbrauchsprofil.
              Keine generische Faustformel.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--solar-emerald)]/12 text-[color:var(--solar-emerald)]">
                    <Sparkles className="size-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/solarrechner"
                className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[color:var(--solar-navy)] px-5 text-sm font-semibold text-[color:var(--solar-navy-foreground)] transition-transform hover:-translate-y-0.5"
              >
                <Calculator className="size-4" /> Solarpotenzial berechnen
              </Link>
              <Link
                href="/services"
                className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Wie wir vorgehen <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <PreviewVisual reduce={!!reduce} />
        </div>
      </motion.div>
    </section>
  );
}

function PreviewVisual({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f33] via-[#0b1f33] to-[#07111d] p-6 lg:p-8">
      <div className="absolute -top-16 -right-16 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,184,65,0.35)_0%,transparent_60%)] blur-2xl" />
      <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(107,160,37,0.35)_0%,transparent_60%)] blur-2xl" />
      <div className="relative grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--solar-gold)]">
            Empfohlene Anlage
          </p>
          <p className="mt-1 text-3xl font-semibold text-white">9,8 kWp</p>
          <p className="mt-1 text-xs text-white/60">~ 49 m² Modulfläche</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Jahresproduktion" value="≈ 9'400 kWh" />
          <Stat label="Eigenverbrauch" value="≈ 38 %" />
          <Stat label="Ersparnis / Jahr" value="≈ CHF 1'700" />
          <Stat label="Amortisation" value="≈ 11 J." />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.4, duration: reduce ? 0 : 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/65"
        >
          Beispielwerte. Ihre persönliche Auswertung berücksichtigt Kanton,
          Ausrichtung, Verschattung und Verbrauchsprofil.
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
