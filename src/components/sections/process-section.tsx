"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Analyse",
    description:
      "Bedarfsklärung, Dachprüfung, Ausrichtung, Verschattung, Verbrauchsprofil. Wir hören zu, bevor wir planen.",
  },
  {
    n: "02",
    title: "Offerte & Förderung",
    description:
      "Transparente Auslegung, klare Investitionsspanne, Förderoptionen via Pronovo und kantonale Programme.",
  },
  {
    n: "03",
    title: "Installation",
    description:
      "Montage durch eigene Teams, koordiniert mit Elektriker und Verteilnetzbetreiber. Saubere Baustelle, dokumentierte Schritte.",
  },
  {
    n: "04",
    title: "Anschluss & Abnahme",
    description:
      "Netzanschluss, Sicherheitsnachweis, Inbetriebnahme und behördliche Abnahme inklusive aller Protokolle.",
  },
  {
    n: "05",
    title: "Monitoring & Wartung",
    description:
      "Laufende Ertragskontrolle, Wartungsfenster, Reaktion bei Auffälligkeiten und planbare Servicekosten.",
  },
];

export function ProcessSection() {
  const reduce = useReducedMotion();
  return (
    <section id="prozess" className="surface-navy grain-overlay relative overflow-hidden">
      <div className="container-page relative py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--solar-gold)]">
            Ihr Weg zur eigenen Solaranlage
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[44px]">
            Fünf klare Schritte. Keine Überraschungen.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Wir arbeiten nach einem strukturierten Prozess – damit Sie zu jedem Zeitpunkt
            wissen, was als nächstes kommt und welche Entscheidungen anstehen.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 lg:grid-cols-5">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: reduce ? 0 : i * 0.07,
                duration: reduce ? 0 : 0.55,
              }}
              className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <span className="font-mono text-xs font-semibold text-[color:var(--solar-gold)]">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{s.description}</p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-12px] top-1/2 hidden h-px w-6 -translate-y-1/2 bg-white/15 lg:block"
                />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
