import type { Metadata } from "next";
import { Compass, HandshakeIcon, Leaf, Shield } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Über uns – Schweizer Photovoltaik aus Grenchen",
  description:
    "DoubleA Solar Solutions ist ein Schweizer Solarunternehmen mit Sitz in Grenchen. Wir verbinden präzise Auslegung, sauberes Handwerk und langfristige Betreuung.",
};

const values = [
  {
    icon: Compass,
    title: "Klarheit vor Verkauf",
    text:
      "Wir empfehlen nur Anlagen, die wirtschaftlich und technisch zu Ihrem Gebäude passen. Auch wenn das ‹weniger› bedeutet.",
  },
  {
    icon: Shield,
    title: "Qualität ist Standard",
    text:
      "Wir setzen auf bewährte Komponenten mit langer Garantie und planen so, dass Service über 25 Jahre planbar bleibt.",
  },
  {
    icon: Leaf,
    title: "Nachhaltig im Detail",
    text:
      "Materialwahl, Logistik und Verpackung werden bewusst gestaltet. Nachhaltigkeit endet nicht beim verkauften Modul.",
  },
  {
    icon: HandshakeIcon,
    title: "Persönlich verantwortlich",
    text:
      "Sie haben feste Ansprechpersonen – von der ersten Begehung bis lange nach der Inbetriebnahme.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <section className="container-page pt-12 pb-10 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Über uns
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Schweizer Solartechnik mit klarem Anspruch.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            {siteConfig.legalName} ist in der Region Grenchen verankert und in der
            ganzen Schweiz tätig. Wir planen, installieren und betreuen Photovoltaik­
            anlagen für Privatpersonen, Eigentümergemeinschaften und Unternehmen –
            mit dem Anspruch, dass jede Anlage zu ihrem Gebäude passt.
          </p>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <article
                key={v.title}
                className="surface-glass flex flex-col gap-3 rounded-2xl p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--solar-navy)]/8 text-[color:var(--solar-navy)] ring-1 ring-[color:var(--solar-navy)]/10">
                  <Icon className="size-5" />
                </span>
                <h2 className="text-lg font-semibold text-foreground">{v.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-3xl border border-border bg-card p-7 lg:p-10">
          <h2 className="text-2xl font-semibold text-foreground">
            Was Sie von uns erwarten dürfen
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Standortbegehung mit dokumentierter Auswertung – nicht nur ein Pauschalangebot.",
              "Verständliche Offerten mit klar getrennten Positionen.",
              "Eigene Montageteams; keine wechselnden Subunternehmen ohne Abstimmung.",
              "Saubere Inbetriebnahme inklusive Sicherheitsnachweis und Übergabe.",
              "Online-Monitoring und definierte Servicefenster nach Inbetriebnahme.",
              "Klare Reaktionszeiten bei Störungen – schweizweit erreichbar.",
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
        </div>
      </section>

      <CtaBand
        title="Lernen wir uns kennen."
        description="Ein gutes Solarprojekt beginnt mit einem ehrlichen Gespräch. Buchen Sie ein unverbindliches Erstgespräch."
        primaryHref="/kontakt"
        primaryLabel="Beratung anfragen"
        secondaryHref="/services"
        secondaryLabel="Unsere Leistungen"
      />
    </>
  );
}
