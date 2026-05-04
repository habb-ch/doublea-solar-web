import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  ClipboardCheck,
  Compass,
  HardHat,
  LineChart,
  Wrench,
} from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Leistungen – Photovoltaik von der Analyse bis zur Wartung",
  description:
    "Standortanalyse, Planung, Förderberatung, Installation, Batteriespeicher und Monitoring – DoubleA Solar Solutions begleitet Schweizer Anlagen über den gesamten Lebenszyklus.",
};

const services = [
  {
    id: "standortanalyse",
    icon: Compass,
    title: "Standortanalyse",
    summary:
      "Bevor wir auslegen, verstehen wir Ihr Gebäude – Dachgeometrie, Statik, Verschattung, Verbrauchsprofil.",
    points: [
      "Vor-Ort-Begehung mit Vermessung und Fotodokumentation",
      "Auswertung von Verschattung über das Jahr",
      "Prüfung der Dachstatik und Befestigungssituation",
      "Verbrauchsanalyse anhand Strom- und Heizungsrechnungen",
    ],
  },
  {
    id: "planung",
    icon: ClipboardCheck,
    title: "Planung & Auslegung",
    summary:
      "Wir dimensionieren die Anlage so, dass sie heute und in zehn Jahren passt – inklusive Wärmepumpe und Elektroauto.",
    points: [
      "Auslegung Module, Wechselrichter und Verkabelung",
      "Optimierung Eigenverbrauch und Lastmanagement",
      "Dachstatik und Brandschutz im Konzept berücksichtigt",
      "Klar verständliche Anlagenpläne und Erträge",
    ],
  },
  {
    id: "foerderung",
    icon: LineChart,
    title: "Förderberatung",
    summary:
      "Pronovo EIV, kantonale Programme und Steueraspekte – wir begleiten Sie durch die Anträge.",
    points: [
      "Berechnung der voraussichtlichen Einmalvergütung",
      "Antragsstellung und Kommunikation mit Pronovo",
      "Prüfung kantonaler Förderprogramme",
      "Hinweise zu Steuerabzug und Energieeffizienz",
    ],
  },
  {
    id: "installation",
    icon: HardHat,
    title: "Installation & Netzanschluss",
    summary:
      "Eigene Montageteams, klare Bauphasen, sauberer Anschluss durch konzessionierte Elektriker.",
    points: [
      "Montage durch zertifizierte Solartechnikerinnen und -techniker",
      "Koordination mit dem Verteilnetzbetreiber",
      "Sicherheitsnachweis und Inbetriebnahme inkl. Protokoll",
      "Übergabe inkl. Bedienungseinweisung",
    ],
  },
  {
    id: "batterie",
    icon: BatteryCharging,
    title: "Batterie & Eigenverbrauchsoptimierung",
    summary:
      "Speicher rechnen sich nicht in jedem Fall. Wir prüfen ehrlich – und empfehlen nur, was Sinn ergibt.",
    points: [
      "Lastganganalyse und Eigenverbrauchssimulation",
      "Auslegung passender Speichergrösse",
      "Lastmanagement für Wallbox und Wärmepumpe",
      "Erweiterungsoption für bestehende Anlagen",
    ],
  },
  {
    id: "monitoring",
    icon: Wrench,
    title: "Monitoring & Wartung",
    summary:
      "Eine PV-Anlage ist eine 25-Jahres-Investition. Wir bleiben an Ihrer Seite.",
    points: [
      "Online-Monitoring mit Erkennung von Anomalien",
      "Definierte Wartungsfenster und Reinigungsangebote",
      "Wechselrichter-Service und Garantieabwicklung",
      "Reaktionszeiten, die in der Schweiz funktionieren",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="container-page pt-12 pb-10 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Leistungen
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Eine Anlage. Ein Team. Verantwortung von Anfang bis Betrieb.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Photovoltaik ist Handwerk und Ingenieursarbeit zugleich. Wir bündeln
            Beratung, Planung, Bau und Betrieb – damit Ihre Anlage nicht nur
            installiert ist, sondern über Jahrzehnte sauber funktioniert.
          </p>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-8">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                id={s.id}
                className="surface-glass scroll-mt-24 rounded-3xl p-7 lg:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
                  <div>
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[color:var(--solar-navy)]/8 text-[color:var(--solar-navy)] ring-1 ring-[color:var(--solar-navy)]/10">
                      <Icon className="size-6" />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      {s.summary}
                    </p>
                    <Link
                      href="/kontakt"
                      className="ring-focus mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--solar-emerald)] hover:gap-2 transition-[gap]"
                    >
                      Beratung anfragen <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <ul className="grid gap-2.5 self-center">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 rounded-xl border border-border/70 bg-background/60 p-3.5 text-sm leading-relaxed text-foreground/85"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--solar-emerald)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Fragen zu einer spezifischen Leistung?"
        description="Wir beraten Sie ohne Verkaufsdruck und sagen ehrlich, ob ein Schritt in Ihrer Situation Sinn ergibt."
        primaryHref="/kontakt"
        primaryLabel="Beratung vereinbaren"
        secondaryHref="/solarrechner"
        secondaryLabel="Solarpotenzial berechnen"
      />
    </>
  );
}
