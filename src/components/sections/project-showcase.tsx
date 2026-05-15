"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Home, Sprout, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const types = [
  {
    icon: Home,
    title: "Einfamilienhaus",
    description:
      "Auslegung 6–15 kWp, oft kombiniert mit Wärmepumpe und kleinem Speicher.",
    typical: "8–12 kWp",
  },
  {
    icon: Building2,
    title: "Mehrfamilienhaus",
    description:
      "Eigenverbrauchsgemeinschaft (ZEV) und Mieterstrommodelle für mehr Wirtschaftlichkeit.",
    typical: "15–60 kWp",
  },
  {
    icon: Sprout,
    title: "Landwirtschaft & Gewerbe",
    description:
      "Grossflächen-Aufdach, hoher Eigenverbrauch tagsüber, klare Amortisationsrechnung.",
    typical: "30–250 kWp",
  },
  {
    icon: Zap,
    title: "Batterie-Nachrüstung",
    description:
      "Speicher und Lastmanagement zu bestehenden Anlagen – ehrlich beurteilt, nicht überdimensioniert.",
    typical: "5–20 kWh",
  },
];

export function ProjectShowcase() {
  const reduce = useReducedMotion();
  return (
    <section id="projekte" className="container-page py-16 sm:py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Ausgewählte Projektarten
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[42px]">
            Vom Familienhaus bis zur Gewerbe-Dachfläche.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Wir bilden in der Schweiz unterschiedliche Anlagengrössen ab. Konkrete
            Referenzobjekte zeigen wir gerne im persönlichen Gespräch –
            <span className="font-medium text-foreground">
              {" "}
              Referenzen auf Anfrage
            </span>
            .
          </p>
        </div>
        <Link
          href="/projekte"
          className="ring-focus inline-flex items-center gap-1.5 self-start text-sm font-medium text-[color:var(--solar-emerald)] hover:gap-2 transition-[gap] lg:self-end"
        >
          Alle Projektarten ansehen
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: reduce ? 0 : i * 0.06,
                duration: reduce ? 0 : 0.5,
              }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[0_18px_40px_-30px_rgba(11,31,51,0.5)]"
            >
              <div className="absolute -top-12 -right-12 size-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,184,65,0.18)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--solar-emerald)]/10 text-[color:var(--solar-emerald)]">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/80">
                Typisch {t.typical}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
