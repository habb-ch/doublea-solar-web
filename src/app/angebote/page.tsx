import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Kostenloses Solarangebot – Photovoltaik in der Schweiz",
  description:
    "Fordern Sie ein kostenloses und unverbindliches Solarangebot an. Wir prüfen Ihr Projekt, klären Förderungen und erstellen eine transparente Offerte.",
};

const inclusions = [
  "Standortanalyse mit Verschattungs- und Statikbewertung",
  "Auslegung Module, Wechselrichter und Speicheroption",
  "Wirtschaftlichkeitsrechnung mit konservativen Annahmen",
  "Prüfung Pronovo EIV und kantonaler Programme",
  "Klar strukturierte Offerte mit allen Positionen",
];

export default function AngebotePage() {
  return (
    <section className="container-page py-12 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Kostenloses Angebot
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Ein Angebot, das wir auch selbst unterschreiben würden.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Ihre Anfrage ist kostenfrei und unverbindlich. Wir melden uns innert eines
            Werktags und besprechen mit Ihnen die nächsten Schritte – ohne Verkaufs­
            druck und ohne Pauschal­versprechen.
          </p>

          <ul className="mt-8 space-y-3">
            {inclusions.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85"
              >
                <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--solar-emerald)]/12 text-[color:var(--solar-emerald)]">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Sie sind unsicher, was sinnvoll dimensioniert ist? Starten Sie mit
            unserem Solarrechner – das Ergebnis dient als Grundlage für die Offerte.
            <Link
              href="/solarrechner"
              className="ring-focus mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--solar-emerald)] hover:gap-2 transition-[gap]"
            >
              <Calculator className="size-4" />
              Zum Solarrechner <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="surface-glass self-start rounded-3xl p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-foreground">
            Angebot anfragen
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Erzählen Sie uns kurz von Ihrem Vorhaben.
          </p>
          <div className="mt-6">
            <LeadForm source="angebote" requireFullDetails />
          </div>
        </div>
      </div>
    </section>
  );
}
