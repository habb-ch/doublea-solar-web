import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von DoubleA Solar Solutions, Grenchen.",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  const { contact, legalName } = siteConfig;
  return (
    <article className="container-page prose prose-neutral max-w-3xl py-16 lg:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Impressum
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Diese Vorlage wurde sorgfältig erstellt. Bitte lassen Sie sie vor der
        Veröffentlichung von einer Schweizer Rechtsberatung prüfen, um die
        Richtigkeit für Ihre konkrete Unternehmensform sicherzustellen.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-foreground">Anbieterin</h2>
      <p className="mt-2 text-foreground/80">
        {legalName}
        <br />
        {contact.address.street}
        <br />
        {contact.address.postalCode} {contact.address.city}
        <br />
        {contact.address.country}
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Kontakt</h2>
      <p className="mt-2 text-foreground/80">
        Telefon: {contact.phone}
        <br />
        E-Mail:{" "}
        <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Handelsregister
      </h2>
      <p className="mt-2 text-foreground/80">
        Eingetragen im Handelsregister des Kantons {contact.address.canton}.
        Die UID-Nummer wird auf Anfrage mitgeteilt und mit Veröffentlichung des
        Impressums ergänzt.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Verantwortlich für den Inhalt
      </h2>
      <p className="mt-2 text-foreground/80">Geschäftsleitung {legalName}.</p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Haftungsausschluss</h2>
      <p className="mt-2 text-foreground/80">
        Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt.
        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
        jedoch keine Gewähr übernehmen. Die Nutzung dieser Website erfolgt auf
        eigenes Risiko.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Urheberrecht</h2>
      <p className="mt-2 text-foreground/80">
        Sämtliche Inhalte dieser Website unterliegen dem schweizerischen
        Urheberrecht. Vervielfältigung und Wiedergabe – ganz oder teilweise –
        bedürfen der vorgängigen schriftlichen Zustimmung.
      </p>
    </article>
  );
}
