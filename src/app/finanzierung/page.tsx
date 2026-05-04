import type { Metadata } from "next";
import { Banknote, FileText, ShieldCheck, Wallet } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Finanzierung – Solaranlage planbar finanzieren",
  description:
    "Eine Photovoltaikanlage ist eine langfristige Investition. Wir besprechen Eigenfinanzierung, Ratenmodelle und Förderungen ehrlich und ohne Verkaufsdruck.",
};

const steps = [
  {
    icon: FileText,
    title: "Transparente Offerte",
    text:
      "Sie erhalten eine klar strukturierte Offerte mit allen Positionen – Material, Montage, Elektroanschluss, Inbetriebnahme.",
  },
  {
    icon: Wallet,
    title: "Eigenfinanzierung",
    text:
      "Wer die Anlage komplett selbst finanziert, profitiert direkt von Steuerabzügen und voller Eigenkapitalrendite.",
  },
  {
    icon: Banknote,
    title: "Ratenfinanzierung",
    text:
      "Auf Wunsch vermitteln wir Schweizer Finanzierungspartner. Sie zahlen monatlich – oft tiefer als die laufende Stromrechnung.",
  },
  {
    icon: ShieldCheck,
    title: "Förderung sauber prüfen",
    text:
      "Pronovo EIV und kantonale Programme werden tagesaktuell beurteilt – wir versprechen keine Pauschalbeträge.",
  },
];

export default function FinanzierungPage() {
  return (
    <>
      <section className="container-page pt-12 pb-10 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Finanzierung
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Solaranlage planbar finanzieren – ohne Wunschrechnungen.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Wir sprechen offen über Investition, Amortisation und Risiken.
            Photovoltaik rechnet sich in vielen Fällen sehr gut – aber nicht in allen.
            Sie erhalten von uns eine ehrliche Einschätzung statt aggressiver
            Verkaufsargumente.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="surface-glass flex flex-col gap-3 rounded-2xl p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--solar-gold)]/15 text-[color:var(--solar-navy)]">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-7 lg:p-10">
          <h2 className="text-2xl font-semibold text-foreground">
            Worauf wir bei der Wirtschaftlichkeit achten
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Strompreisentwicklung wird konservativ angenommen, nicht optimistisch.",
              "Eigenverbrauchssteigerung durch Wärmepumpe oder Wallbox wird ausgewiesen.",
              "Wartungskosten und Wechselrichter-Tausch sind in der Lebenszyklusrechnung enthalten.",
              "Förderungen werden nur eingerechnet, wenn der Antrag realistisch ist.",
            ].map((p) => (
              <li
                key={p}
                className="flex gap-3 text-sm leading-relaxed text-foreground/80"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--solar-emerald)]" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-secondary p-4 text-xs text-muted-foreground">
            Hinweis: Wir sind kein Finanzinstitut. Die endgültige Konditionen-Zusage
            erfolgt durch den Finanzierungspartner.
          </p>
        </div>
      </section>

      <CtaBand
        title="Eine Finanzierung, die zu Ihrem Haushalt passt."
        description="Senden Sie uns Ihre Eckdaten – wir bereiten eine Investitionsspanne mit ehrlicher Wirtschaftlichkeitsrechnung vor."
        primaryHref="/angebote"
        primaryLabel="Angebot anfragen"
        secondaryHref="/solarrechner"
        secondaryLabel="Solarpotenzial berechnen"
      />
    </>
  );
}
