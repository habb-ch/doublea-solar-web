import type { Metadata } from "next";
import { Building2, Home, Sprout, Zap } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Projekte – Photovoltaik-Anlagentypen aus der Praxis",
  description:
    "Welche Anlagengrössen wir in der Schweiz typischerweise umsetzen: Einfamilienhaus, Mehrfamilienhaus, Gewerbe, Landwirtschaft und Batterie-Nachrüstungen. Konkrete Referenzen auf Anfrage.",
};

const projectTypes = [
  {
    icon: Home,
    title: "Einfamilienhaus",
    range: "8 – 12 kWp",
    description:
      "Klassische Aufdachanlage mit Eigenverbrauchsoptimierung, häufig kombiniert mit Wärmepumpe und kleinem Speicher (5 – 10 kWh).",
    deliverables: [
      "Standortanalyse, Auslegung, Module und Wechselrichter",
      "Optionaler Speicher und Lastmanagement",
      "Pronovo-EIV-Antrag und Inbetriebnahme inkl. Sicherheitsnachweis",
    ],
  },
  {
    icon: Building2,
    title: "Mehrfamilienhaus / ZEV",
    range: "15 – 60 kWp",
    description:
      "Zusammenschluss zum Eigenverbrauch (ZEV) für Eigentümergemeinschaften, inklusive Mieterstromabrechnung und Messkonzept.",
    deliverables: [
      "Eigenverbrauchsgemeinschaft mit Messkonzept",
      "Abrechnungslösung für Mietparteien",
      "Koordination mit Verteilnetzbetreiber",
    ],
  },
  {
    icon: Sprout,
    title: "Landwirtschaft & Gewerbe",
    range: "30 – 250 kWp",
    description:
      "Grossflächige Aufdachanlagen mit hohem Tageseigenverbrauch. Investitionsentscheid auf Basis Lastprofil und Amortisation.",
    deliverables: [
      "Lastganganalyse und Wirtschaftlichkeitsberechnung",
      "Tragwerksprüfung und Brandschutzkonzept",
      "Anschluss Mittel-/Niederspannung in Abstimmung mit dem Netzbetreiber",
    ],
  },
  {
    icon: Zap,
    title: "Batterie-Nachrüstung",
    range: "5 – 20 kWh Speicher",
    description:
      "Nachrüstung bestehender PV-Anlagen mit Speicher, Wallbox-Lastmanagement und Eigenverbrauchsoptimierung.",
    deliverables: [
      "Bestandsaufnahme Wechselrichter und Verkabelung",
      "Auslegung Speicherkapazität anhand Lastprofil",
      "Integration in Smart-Meter / Energiemanagement",
    ],
  },
];

export default function ProjektePage() {
  return (
    <>
      <section className="container-page pt-12 pb-10 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Projekte
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Vom Familiendach bis zur Gewerbe-Halle.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Wir präsentieren auf dieser Seite typische Anlagenformen, die wir in der
            Schweiz realisieren. Konkrete Referenzobjekte zeigen wir gerne im
            persönlichen Gespräch –{" "}
            <span className="font-medium text-foreground">Referenzen auf Anfrage</span>.
            Eine öffentliche Galerie folgt, sobald entsprechende Freigaben vorliegen.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-5 lg:grid-cols-2">
          {projectTypes.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="surface-glass flex flex-col gap-4 rounded-2xl p-6 lg:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--solar-emerald)]/12 text-[color:var(--solar-emerald)]">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/80">
                    Typisch {p.range}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {p.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <ul className="mt-1 space-y-2 text-sm leading-relaxed text-foreground/80">
                  {p.deliverables.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--solar-gold)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-border bg-background/40 p-6 text-sm text-muted-foreground">
          Eine öffentliche Projektgalerie folgt. Wenn Sie Referenzobjekte ähnlich Ihrem
          Vorhaben sehen möchten, vereinbaren Sie ein unverbindliches Gespräch –
          wir zeigen Ihnen passende Beispiele direkt.
        </div>
      </section>

      <CtaBand
        title="Ihr Projekt verdient eine seriöse Auslegung."
        description="Egal ob Einfamilienhaus oder Gewerbedach – wir bewerten Ihr Vorhaben ehrlich und mit klarem Blick auf Wirtschaftlichkeit."
        primaryHref="/angebote"
        primaryLabel="Projekt besprechen"
        secondaryHref="/services"
        secondaryLabel="Unsere Leistungen"
      />
    </>
  );
}
