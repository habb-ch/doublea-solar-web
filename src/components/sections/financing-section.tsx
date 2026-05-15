"use client";

import Link from "next/link";
import { ArrowRight, Banknote, ShieldCheck, Wallet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const points = [
  {
    icon: Wallet,
    title: "Planbare Investition",
    description:
      "Klare Spanne der Gesamtkosten und Restwerte – Sie wissen, woran Sie sind.",
  },
  {
    icon: Banknote,
    title: "Ratenmodelle möglich",
    description:
      "Wir besprechen Finanzierungsoptionen über Schweizer Partner – ohne unrealistische Versprechen.",
  },
  {
    icon: ShieldCheck,
    title: "Förderungen geprüft",
    description:
      "Pronovo EIV und kantonale Beiträge werden tagesaktuell für Ihren Standort beurteilt.",
  },
];

export function FinancingSection() {
  const reduce = useReducedMotion();
  return (
    <section id="finanzierung" className="container-page py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Finanzierung
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[42px]">
            Eine Solaranlage muss ins{" "}
            <span className="gold-underline">Budget</span> passen – nicht nur aufs Dach.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Wir sprechen offen über Investition, Amortisation und Risiken. Sie erhalten
            eine ehrliche Einschätzung statt aggressiver Verkaufsargumente.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/finanzierung"
              className="ring-focus inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--solar-navy)] px-5 text-sm font-medium text-[color:var(--solar-navy-foreground)] transition-transform hover:-translate-y-0.5"
            >
              Finanzierung im Detail
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/kontakt"
              className="ring-focus inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Beratung vereinbaren
            </Link>
          </div>
        </div>

        <ul className="grid gap-3">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: reduce ? 0 : i * 0.06,
                  duration: reduce ? 0 : 0.5,
                }}
                className="surface-glass flex items-start gap-4 rounded-2xl p-5"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--solar-gold)]/15 text-[color:var(--solar-navy)]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
