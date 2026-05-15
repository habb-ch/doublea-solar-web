"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  ClipboardCheck,
  Compass,
  HardHat,
  LineChart,
  Wrench,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const services = [
  {
    id: "standortanalyse",
    title: "Standortanalyse",
    description:
      "Wir prüfen Dachfläche, Ausrichtung, Verschattung und Statik vor Ort und liefern eine fundierte Grundlage für die Auslegung.",
    icon: Compass,
  },
  {
    id: "planung",
    title: "Planung & Auslegung",
    description:
      "Anlagenkonzept passend zu Verbrauch, Wärmepumpe, Elektromobilität und langfristiger Investitionsstrategie.",
    icon: ClipboardCheck,
  },
  {
    id: "foerderung",
    title: "Förderberatung",
    description:
      "Pronovo EIV, kantonale Beiträge und Steueraspekte – klar erklärt und im Antrag begleitet.",
    icon: LineChart,
  },
  {
    id: "installation",
    title: "Installation & Netzanschluss",
    description:
      "Saubere Montage, fachgerechter Netzanschluss, Inbetriebnahme und Abnahme inklusive Dokumentation.",
    icon: HardHat,
  },
  {
    id: "batterie",
    title: "Batterie & Eigenverbrauch",
    description:
      "Speicherauslegung und Lastmanagement für maximalen Eigenverbrauch – sinnvoll dimensioniert, nicht überdimensioniert.",
    icon: BatteryCharging,
  },
  {
    id: "monitoring",
    title: "Monitoring & Wartung",
    description:
      "Ertragsüberwachung, Reinigung, Wechselrichter-Service und Reaktionszeiten, die in der Schweiz zählen.",
    icon: Wrench,
  },
];

export function ServicesSection() {
  const reduce = useReducedMotion();
  return (
    <section id="leistungen" className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
          Unsere Leistungen
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[42px]">
          Eine Anlage. Ein Team. Verantwortung von Anfang bis Betrieb.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Wir bündeln Beratung, Planung, Bau und Betrieb in einer Hand. So entstehen
          Anlagen, die zu Ihrem Gebäude passen – und über Jahrzehnte zuverlässig liefern.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: reduce ? 0 : i * 0.05,
                duration: reduce ? 0 : 0.5,
              }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group surface-glass relative flex flex-col rounded-2xl p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(11,31,51,0.45)]"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--solar-navy)]/8 text-[color:var(--solar-navy)] ring-1 ring-[color:var(--solar-navy)]/10">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <Link
                href={`/services#${s.id}`}
                className="ring-focus mt-5 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-medium text-[color:var(--solar-emerald)] hover:gap-2 transition-[gap]"
                aria-label={`Mehr zu ${s.title}`}
              >
                Mehr erfahren
                <ArrowUpRight className="size-4" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
